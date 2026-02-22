import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Loader2, UploadCloud } from "lucide-react";
import { productsActions, selectProductsStatus, selectProductsError } from "./productsSlice";
import type { ProductDto } from "./productApi";

const AddProduct: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const status = useSelector(selectProductsStatus);
    const error = useSelector(selectProductsError);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<Partial<ProductDto>>({
        defaultValues: {
            is_available: true,
            stock: 0,
        }
    });

    const onSubmit = (data: Partial<ProductDto>) => {
        const formData = new FormData();

        formData.append("name", data.name || "");
        formData.append("description", data.description || "");
        formData.append("category", String(data.category)); // API likely expects ID as string or number
        formData.append("price", String(data.price));
        if (data.discount_price) formData.append("discount_price", String(data.discount_price));
        formData.append("stock", String(data.stock));
        formData.append("is_available", String(Boolean(data.is_available)));
        if (data.sku) formData.append("sku", data.sku);

        // Handle Image File
        if (data.image && (data.image as any).length > 0) {
            formData.append("image", (data.image as any)[0]);
        }

        // @ts-ignore
        dispatch(productsActions.createProductRequest(formData));
    };

    // Reset status on mount
    useEffect(() => {
        dispatch(productsActions.resetStatus());
        return () => {
            dispatch(productsActions.resetStatus());
        };
    }, [dispatch]);

    // Watch for success to redirect
    useEffect(() => {
        if (status === 'succeeded') {
            navigate("/admin/products");
        }
    }, [status, navigate]);

    return (
        <div className="min-h-screen bg-[#FDFDFD] p-6 md:p-12 space-y-8 animate-in slide-in-from-right duration-500">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/admin/products")}
                        className="p-2 hover:bg-[#F4F4F5] rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
                        <p className="text-sm text-[#71717A]">Create a new item in your inventory.</p>
                    </div>
                </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
                    {error}
                </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-8">

                {/* Basic Info */}
                <section className="bg-white border border-[#EEEEEE] rounded-2xl p-6 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold">Basic Information</h2>

                    <div className="grid gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-[#A1A1AA]">Product Name</label>
                            <input
                                {...register("name", { required: "Name is required" })}
                                className="w-full px-4 py-3 bg-[#FAFAFA] border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black outline-none transition-all"
                                placeholder="e.g. Fresh Atlantic Salmon"
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-[#A1A1AA]">Description</label>
                            <textarea
                                {...register("description", { required: "Description is required" })}
                                className="w-full px-4 py-3 bg-[#FAFAFA] border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black outline-none transition-all h-32 resize-none"
                                placeholder="Detailed description of the product..."
                            />
                            {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                        </div>
                    </div>
                </section>

                {/* Pricing & Inventory */}
                <section className="bg-white border border-[#EEEEEE] rounded-2xl p-6 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold">Pricing & Inventory</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-[#A1A1AA]">Price</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#A1A1AA]">AED</span>
                                <input
                                    type="number" step="0.01"
                                    {...register("price", { required: "Price is required" })}
                                    className="w-full pl-8 pr-4 py-3 bg-[#FAFAFA] border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black outline-none transition-all"
                                    placeholder="0.00"
                                />
                            </div>
                            {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-[#A1A1AA]">Discount Price (Opt)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#A1A1AA]">AED</span>
                                <input
                                    type="number" step="0.01"
                                    {...register("discount_price")}
                                    className="w-full pl-8 pr-4 py-3 bg-[#FAFAFA] border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black outline-none transition-all"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-[#A1A1AA]">Stock Quantity</label>
                            <input
                                type="number"
                                {...register("stock", { required: "Stock is required", min: 0 })}
                                className="w-full px-4 py-3 bg-[#FAFAFA] border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black outline-none transition-all"
                                placeholder="0"
                            />
                            {errors.stock && <p className="text-red-500 text-xs">{errors.stock.message}</p>}
                        </div>
                    </div>
                </section>

                {/* Category & Attributes */}
                <section className="bg-white border border-[#EEEEEE] rounded-2xl p-6 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold">Organization</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-[#A1A1AA]">Category ID</label>
                            <input
                                type="number"
                                {...register("category", { required: "Category ID is required" })}
                                className="w-full px-4 py-3 bg-[#FAFAFA] border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black outline-none transition-all"
                                placeholder="e.g. 1"
                            />
                            <p className="text-[10px] text-[#A1A1AA]">Enter the ID of the category (e.g., 1 for Fish)</p>
                            {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-[#A1A1AA]">Unit / SKU</label>
                            <input
                                {...register("sku")}
                                className="w-full px-4 py-3 bg-[#FAFAFA] border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black outline-none transition-all"
                                placeholder="e.g. FISH-001"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            {...register("is_available")}
                            className="w-5 h-5 accent-black rounded cursor-pointer"
                        />
                        <label className="text-sm font-medium cursor-pointer">Available for purchase</label>
                    </div>
                </section>

                {/* Media */}
                <ImageUploadSection register={register} watch={watch} />

                {/* Actions */}
                <div className="flex items-center justify-end gap-4 pt-4 pb-12">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/products")}
                        className="px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#F4F4F5] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="px-8 py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-[#222] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                        {status === 'loading' ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Create Product
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

const ImageUploadSection = ({ register, watch }: { register: any, watch: any }) => {
    const files = watch("image");
    const [preview, setPreview] = React.useState<string | null>(null);

    useEffect(() => {
        if (files && files.length > 0) {
            const file = files[0];
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreview(null);
        }
    }, [files]);

    return (
        <section className="bg-white border border-[#EEEEEE] rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold">Media</h2>
            <div className={`border-2 border-dashed border-[#E4E4E7] rounded-xl flex flex-col items-center justify-center text-center bg-[#FAFAFA] hover:bg-[#F4F4F5] transition-colors relative cursor-pointer overflow-hidden ${preview ? 'p-0' : 'p-8 gap-4'}`}>
                <input
                    type="file"
                    accept="image/*"
                    {...register("image")}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {preview ? (
                    <div className="relative w-full h-64">
                        <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <p className="text-white font-bold text-sm">Click to change image</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-[#71717A]">
                            <UploadCloud size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Click to upload main image</p>
                            <p className="text-xs text-[#A1A1AA]">SVG, PNG, JPG or GIF (max. 5MB)</p>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default AddProduct;
