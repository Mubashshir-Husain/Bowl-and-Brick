import React, { useEffect, useState, useMemo } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../../services/menuService';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

const CATEGORIES = ['Starter', 'Main Course', 'Dessert', 'Beverage'];
const TYPES = ['Veg', 'Non-Veg', 'Vegan'];
const SPICE_LEVELS = ['Low', 'Medium', 'High'];

const AdminMenuPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    category: 'Starter',
    type: 'Veg',
    price: '',
    description: '',
    spiceLevel: 'Medium',
    ingredients: '',
    available: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const data = await getMenuItems();
      setItems(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(typeof err === 'string' ? err : 'Failed to fetch menu items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Starter',
      type: 'Veg',
      price: '',
      description: '',
      spiceLevel: 'Medium',
      ingredients: '',
      available: true,
    });
    setImageFile(null);
    setImagePreview('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      category: item.category || 'Starter',
      type: item.type || 'Veg',
      price: item.price !== undefined ? item.price : '',
      description: item.description || '',
      spiceLevel: item.spiceLevel || 'Medium',
      ingredients: Array.isArray(item.ingredients) ? item.ingredients.join(', ') : '',
      available: item.available !== false,
    });
    setImageFile(null);
    setImagePreview(item.imageUrl || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFormError('Please select a valid image file (JPG, PNG, WEBP, etc.)');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFormError(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleToggleAvailability = async (item) => {
    try {
      const updated = await updateMenuItem(item._id, { available: !item.available });
      setItems((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, available: updated.available } : i))
      );
    } catch (err) {
      alert(typeof err === 'string' ? err : 'Failed to update availability');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await deleteMenuItem(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      alert(typeof err === 'string' ? err : 'Failed to delete item');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) return setFormError('Dish name is required');
    if (!formData.price || isNaN(formData.price)) return setFormError('Valid price is required');

    setSubmitting(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name.trim());
      formDataObj.append('category', formData.category);
      formDataObj.append('type', formData.type);
      formDataObj.append('price', Number(formData.price));
      formDataObj.append('description', formData.description.trim());
      formDataObj.append('spiceLevel', formData.spiceLevel);
      formDataObj.append('available', formData.available);

      const ingredientsList = formData.ingredients
        ? formData.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      ingredientsList.forEach((ing) => formDataObj.append('ingredients', ing));

      if (imageFile) {
        formDataObj.append('image', imageFile);
      } else if (imagePreview) {
        formDataObj.append('imageUrl', imagePreview);
      }

      if (editingItem) {
        const updated = await updateMenuItem(editingItem._id, formDataObj);
        setItems((prev) => prev.map((i) => (i._id === editingItem._id ? updated : i)));
      } else {
        const created = await createMenuItem(formDataObj);
        setItems((prev) => [created, ...prev]);
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setFormError(typeof err === 'string' ? err : 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = item.name?.toLowerCase().includes(q);
        const descMatch = item.description?.toLowerCase().includes(q);

        if (!nameMatch && !descMatch) return false;
      }

      return true;
    });
  }, [items, categoryFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#100C09] text-[#F7F4ED] pb-20">

      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-5 pt-5 pb-8 space-y-5">

        {/* Top Control Bar */}

        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#15110E] border border-[#C8A96B]/20 p-3.5 rounded-xl shadow-sm">

          <div className="flex items-center gap-2.5">

            <h2 className="text-base font-black text-[#F7F4ED]">
              Menu Management
            </h2>

            <span className="text-xs bg-[#C8A96B]/10 text-[#C8A96B] font-extrabold px-2.5 py-0.5 rounded-full border border-[#C8A96B]/20">
              {items.length} Items Total
            </span>

          </div>

          <button
            onClick={openAddModal}
            className="bg-[#C8A96B] text-[#100C09] hover:bg-[#D8BB7C] py-2 px-3.5 text-xs font-extrabold flex items-center gap-1.5 rounded-lg shadow-sm active:scale-95 transition"
          >
            <Plus size={15} /> Add New Dish
          </button>

        </div>

        {/* Filter Bar */}

        <div className="bg-[#15110E] border border-[#C8A96B]/20 p-3.5 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">

          <div className="relative flex-1 min-w-[240px]">

            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]"
            />

            <input
              type="text"
              placeholder="Search dish by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-[#100C09] border border-[#C8A96B]/20 rounded-xl text-xs text-[#F7F4ED] placeholder-[#EEEEEE]/30 focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/10 transition"
            />

          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">

            {['All', ...CATEGORIES].map((cat) => (

              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap border ${
                  categoryFilter === cat
                    ? 'bg-[#C8A96B] text-[#100C09] border-[#C8A96B] shadow-sm'
                    : 'bg-[#100C09] text-[#EEEEEE]/65 border-[#C8A96B]/15 hover:bg-[#C8A96B]/10 hover:text-[#F7F4ED] hover:border-[#C8A96B]/30'
                }`}
              >
                {cat}
              </button>

            ))}

          </div>

        </div>

        {/* Loading */}

        {loading && (

          <div className="py-14 text-center space-y-2">

            <div className="w-8 h-8 border-3 border-[#C8A96B] border-t-transparent rounded-full animate-spin mx-auto" />

            <p className="text-xs font-bold text-[#EEEEEE]/45">
              Loading menu items...
            </p>

          </div>

        )}

        {/* Error */}

        {error && (

          <div className="bg-[#15110E] border border-red-400/20 p-5 rounded-xl text-center space-y-3">

            <p className="text-xs font-bold text-red-300">
              {error}
            </p>

            <button
              onClick={fetchMenu}
              className="bg-[#C8A96B] text-[#100C09] hover:bg-[#D8BB7C] text-xs py-2 px-4 rounded-lg font-black transition"
            >
              Retry
            </button>

          </div>

        )}

        {/* Menu Cards Table/Grid */}

        {!loading && !error && (

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

            {filteredItems.map((dish) => (

              <div
                key={dish._id}
                className={`bg-[#15110E] border rounded-2xl overflow-hidden flex flex-col justify-between transition shadow-sm ${
                  dish.available
                    ? 'border-[#C8A96B]/15 hover:border-[#C8A96B]/40'
                    : 'border-red-400/20 bg-red-400/[0.03]'
                }`}
              >
                {/* Dish Image Banner */}
                <div className="relative h-36 w-full overflow-hidden bg-[#100C09] flex items-center justify-center border-b border-[#C8A96B]/15">
                  {dish.imageUrl ? (
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-3xl select-none">
                      {dish.type === 'Non-Veg'
                        ? '🍗'
                        : dish.category === 'Beverage'
                        ? '🍹'
                        : dish.category === 'Dessert'
                        ? '🍰'
                        : '🍲'}
                    </span>
                  )}
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-black uppercase tracking-wider text-[#C8A96B] bg-[#100C09]/90 px-2.5 py-0.5 rounded-full border border-[#C8A96B]/30 backdrop-blur-sm">
                    {dish.category}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">

                  <div>

                    <div className="flex items-start justify-between gap-2">

                      <h3 className="font-extrabold text-sm text-[#F7F4ED]">
                        {dish.name}
                      </h3>

                      <span className="text-lg font-black text-[#C8A96B] shrink-0">
                        ₹{dish.price}
                      </span>

                    </div>

                    <div className="flex items-center gap-2 mt-2 text-xs">

                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          dish.type === 'Veg'
                            ? 'bg-[#8FA28A]/15 text-[#C7D3C0] border border-[#8FA28A]/30'
                            : dish.type === 'Non-Veg'
                            ? 'bg-red-400/10 text-red-300 border border-red-400/20'
                            : 'bg-[#8FA28A]/15 text-[#C7D3C0] border border-[#8FA28A]/30'
                        }`}
                      >
                        {dish.type}
                      </span>

                      {dish.spiceLevel && (

                        <span className="text-[#EEEEEE]/45 font-semibold text-[11px]">
                          Spice: {dish.spiceLevel}
                        </span>

                      )}

                    </div>

                    {dish.description && (

                      <p className="text-xs font-medium text-[#EEEEEE]/50 mt-1.5 line-clamp-2">
                        {dish.description}
                      </p>

                    )}

                    {dish.ingredients && dish.ingredients.length > 0 && (

                      <div className="flex flex-wrap gap-1 mt-2">

                        {dish.ingredients.map((ing, idx) => (

                          <span
                            key={idx}
                            className="text-[10px] font-bold bg-[#100C09] text-[#EEEEEE]/55 px-2 py-0.5 rounded-md border border-[#C8A96B]/15"
                          >
                            {ing}
                          </span>

                        ))}

                      </div>

                    )}

                  </div>

                  {/* Actions Footer */}

                  <div className="pt-2.5 border-t border-[#C8A96B]/10 flex items-center justify-between gap-2 text-xs font-bold">

                    <button
                      onClick={() => handleToggleAvailability(dish)}
                      className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition text-[11px] border ${
                        dish.available
                          ? 'bg-[#8FA28A]/10 text-[#C7D3C0] border-[#8FA28A]/25 hover:bg-[#8FA28A]/20'
                          : 'bg-red-400/10 text-red-300 border-red-400/20 hover:bg-red-400/15'
                      }`}
                    >

                      {dish.available ? (

                        <>
                          <Eye size={13} /> Available
                        </>

                      ) : (

                        <>
                          <EyeOff size={13} /> Unavailable
                        </>

                      )}

                    </button>

                    <div className="flex items-center gap-1">

                      <button
                        onClick={() => openEditModal(dish)}
                        className="p-1.5 text-[#EEEEEE]/50 hover:text-[#C8A96B] hover:bg-[#C8A96B]/10 rounded-lg transition"
                        title="Edit dish"
                      >
                        <Edit2 size={15} />
                      </button>

                      <button
                        onClick={() => handleDelete(dish._id)}
                        className="p-1.5 text-red-400/70 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition"
                        title="Delete dish"
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

        {/* Add / Edit Dish Modal */}

        {isModalOpen && (

          <div className="fixed inset-0 z-50 bg-[#100C09]/85 backdrop-blur-md overflow-y-auto p-3 sm:p-5">

            <div className="relative w-full max-w-2xl mx-auto my-3 sm:my-6 bg-[#15110E] border border-[#C8A96B]/25 text-[#F7F4ED] rounded-2xl shadow-2xl overflow-hidden max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-3rem)] flex flex-col">

              <div className="shrink-0 flex items-center justify-between border-b border-[#C8A96B]/15 px-4 sm:px-5 py-3 bg-[#15110E]">

                <h3 className="font-black text-base text-[#F7F4ED]">
                  {editingItem ? 'Edit Dish' : 'Add New Dish'}
                </h3>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full text-[#EEEEEE]/45 hover:text-[#C8A96B] hover:bg-[#C8A96B]/10 transition"
                >
                  <X size={18} />
                </button>

              </div>

              {formError && (

                <div className="p-2.5 bg-red-400/10 border border-red-400/20 text-red-300 text-xs font-bold rounded-xl flex items-center gap-1.5">

                  <AlertCircle
                    size={15}
                    className="shrink-0 text-red-400"
                  />

                  <span>{formError}</span>

                </div>

              )}

              <form onSubmit={handleFormSubmit} className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-5 py-4 space-y-4 text-xs overscroll-contain">

                <div>

                  <label className="block font-bold text-[#C8A96B]/80 uppercase tracking-wider mb-1 text-[10px]">
                    Dish Name *
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Paneer Butter Masala"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#100C09] border border-[#C8A96B]/30 rounded-xl px-3 py-2.5 text-sm font-medium text-[#F7F4ED] placeholder-[#EEEEEE]/40 focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/15 transition"
                    required
                  />

                </div>

                <div className="grid grid-cols-2 gap-3">

                  <div>

                    <label className="block font-bold text-[#C8A96B]/80 uppercase tracking-wider mb-1 text-[10px]">
                      Category *
                    </label>

                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-[#100C09] border border-[#C8A96B]/30 rounded-xl px-3 py-2.5 text-sm font-medium text-[#F7F4ED] focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/15 transition"
                    >

                      {CATEGORIES.map((c) => (

                        <option key={c} value={c}>
                          {c}
                        </option>

                      ))}

                    </select>

                  </div>

                  <div>

                    <label className="block font-bold text-[#C8A96B]/80 uppercase tracking-wider mb-1 text-[10px]">
                      Dietary Type *
                    </label>

                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-[#100C09] border border-[#C8A96B]/30 rounded-xl px-3 py-2.5 text-sm font-medium text-[#F7F4ED] focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/15 transition"
                    >

                      {TYPES.map((t) => (

                        <option key={t} value={t}>
                          {t}
                        </option>

                      ))}

                    </select>

                  </div>

                </div>

                <div className="grid grid-cols-2 gap-3">

                  <div>

                    <label className="block font-bold text-[#C8A96B]/80 uppercase tracking-wider mb-1 text-[10px]">
                      Price (₹) *
                    </label>

                    <input
                      type="number"
                      placeholder="250"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-[#100C09] border border-[#C8A96B]/30 rounded-xl px-3 py-2.5 text-sm font-medium text-[#F7F4ED] placeholder-[#EEEEEE]/40 focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/15 transition"
                      required
                    />

                  </div>

                  <div>

                    <label className="block font-bold text-[#C8A96B]/80 uppercase tracking-wider mb-1 text-[10px]">
                      Spice Level
                    </label>

                    <select
                      value={formData.spiceLevel}
                      onChange={(e) => setFormData({ ...formData, spiceLevel: e.target.value })}
                      className="w-full bg-[#100C09] border border-[#C8A96B]/30 rounded-xl px-3 py-2.5 text-sm font-medium text-[#F7F4ED] focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/15 transition"
                    >

                      {SPICE_LEVELS.map((s) => (

                        <option key={s} value={s}>
                          {s}
                        </option>

                      ))}

                    </select>

                  </div>

                </div>

                <div>

                  <label className="block font-bold text-[#C8A96B]/80 uppercase tracking-wider mb-1 text-[10px]">
                    Description
                   </label>

                  <textarea
                    placeholder="Short description of dish..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full bg-[#100C09] border border-[#C8A96B]/30 rounded-xl px-3 py-2.5 text-sm font-medium text-[#F7F4ED] placeholder-[#EEEEEE]/40 focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/15 transition resize-none"
                  />

                </div>

                <div>

                  <label className="block font-bold text-[#C8A96B]/80 uppercase tracking-wider mb-1 text-[10px]">
                    Ingredients (Comma separated)
                  </label>

                  <input
                    type="text"
                    placeholder="Paneer, Butter, Tomatoes, Cream"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    className="w-full bg-[#100C09] border border-[#C8A96B]/30 rounded-xl px-3 py-2.5 text-sm font-medium text-[#F7F4ED] placeholder-[#EEEEEE]/40 focus:outline-none focus:border-[#C8A96B] focus:ring-2 focus:ring-[#C8A96B]/15 transition"
                  />

                </div>

                <div>

                  <label className="block font-bold text-[#C8A96B]/80 uppercase tracking-wider mb-1 text-[10px]">
                    Dish Image
                  </label>

                  {imagePreview ? (
                    <div className="relative w-full h-32 sm:h-36 rounded-xl overflow-hidden border border-[#C8A96B]/30 group bg-[#100C09]">
                      <img
                        src={imagePreview}
                        alt="Dish Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <label className="cursor-pointer bg-[#C8A96B] text-[#100C09] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow">
                          <Upload size={14} /> Change Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="bg-red-500/80 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-[#C8A96B]/30 hover:border-[#C8A96B]/60 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer bg-[#100C09] hover:bg-[#C8A96B]/5 transition text-center min-h-28">
                      <ImageIcon className="text-[#C8A96B]/60 mb-1" size={24} />
                      <span className="text-xs font-bold text-[#F7F4ED]">Click to upload dish image</span>
                      <span className="text-[10px] text-[#EEEEEE]/40 mt-0.5">JPG, PNG, WEBP allowed (Uploaded to Cloudinary)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}

                </div>

                <div className="flex items-center gap-2 pt-1">

                  <input
                    type="checkbox"
                    id="availableCheck"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="rounded border-[#C8A96B]/30 text-[#C8A96B] focus:ring-[#C8A96B] bg-[#100C09]"
                  />

                  <label
                    htmlFor="availableCheck"
                    className="font-bold text-[#F7F4ED] cursor-pointer"
                  >
                    Available for ordering
                  </label>

                </div>

                <div className="shrink-0 pt-3 border-t border-[#C8A96B]/15 mt-1 flex justify-end gap-2 bg-[#15110E] sticky bottom-0">

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-[#100C09] border border-[#C8A96B]/20 text-[#EEEEEE]/65 hover:text-[#F7F4ED] hover:border-[#C8A96B]/40 text-xs px-3.5 py-1.5 rounded-lg font-bold transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#C8A96B] text-[#100C09] hover:bg-[#D8BB7C] text-xs px-4 py-1.5 rounded-lg font-black shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting
                      ? 'Saving...'
                      : editingItem
                      ? 'Save Changes'
                      : 'Create Item'}
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </main>

    </div>
  );
};

export default AdminMenuPage;