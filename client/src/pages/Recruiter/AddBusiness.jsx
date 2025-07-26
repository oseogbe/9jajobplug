import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Image } from 'lucide-react';

import GooglePlacesAutocomplete from '@/components/GooglePlacesAutocomplete';
import Spinner from '@/components/Spinner';
import { AuthContext } from '@/context/AuthContext';
import { API_BASE_URL } from '@/utils/api';

import { Industries, OrganizationSizes, OrganizationTypes } from '@/assets/assets';

const AddBusiness = () => {
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [formPreview, setFormPreview] = useState({
        name: '',
        tagline: '',
        industry: '',
        logo: null,
    });

    const fileInputRef = useRef();

    const navigate = useNavigate();

    const { accessToken } = useContext(AuthContext);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm();

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
            setFormPreview((prev) => ({ ...prev, logo: URL.createObjectURL(file) }));
        }
    };

    const handleFormChange = (field, value) => {
        setFormPreview((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });
            if (logoFile) formData.append('logo', logoFile);
            const res = await fetch(`${API_BASE_URL}/business/create`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData,
                credentials: 'include',
            });
            const result = await res.json();
            if (res.ok) {
                toast.success('Business created');
                navigate('/dashboard');
            } else {
                toast.error(result.message || 'Failed to create business');
            }
        } catch (err) {
            toast.error(err.message || 'Failed to create business');
        }
    };

    const handleSkip = () => {
        navigate('/dashboard');
    };

    return (
        <div className="py-8 px-2 mx-auto">
            <div className="w-full flex flex-col md:flex-row md:items-start md:justify-center gap-8 mx-auto max-w-6xl">
                {/* Form Section */}
                <div className="flex-1 bg-white rounded-2xl shadow p-8 mx-auto max-w-xl min-w-[320px]">
                    <h2 className="text-2xl font-semibold mb-2 text-gray-900 text-center">Add Your Business</h2>
                    <p className="text-gray-500 text-center mb-6 text-sm">Create a business profile to start posting jobs. You can skip this step and add a business later.</p>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Logo upload with preview */}
                        <div className="flex flex-col items-center mb-2">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                {logoPreview ? (
                                    <img
                                        src={logoPreview}
                                        alt="Business Logo Preview"
                                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 shadow-sm mx-auto"
                                    />
                                ) : (
                                    <span className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 border-2 border-gray-200 shadow-sm mx-auto">
                                        <Image size={40} />
                                    </span>
                                )}
                                <button
                                    type="button"
                                    className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-1 shadow hover:bg-primary-dark transition"
                                    tabIndex={-1}
                                >
                                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>
                                </button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleLogoChange}
                                />
                            </div>
                            <span className="text-xs text-gray-500 mt-2">Upload business logo</span>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Business Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                {...register('name', {
                                    required: 'Business name is required',
                                    minLength: 2,
                                    onChange: (e) => handleFormChange('name', e.target.value),
                                })}
                                className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded truncate"
                                style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                            />
                            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Tagline <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                {...register('tagline', {
                                    required: 'Tagline is required',
                                    minLength: 8,
                                    maxLength: 50,
                                    onChange: (e) => handleFormChange('tagline', e.target.value),
                                })}
                                className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded truncate"
                                style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                            />
                            {errors.name && <span className="text-xs text-red-500">{errors.tagline.message}</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input type="email" {...register('email')} className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                {...register('description', {
                                    onChange: (e) => handleFormChange('description', e.target.value),
                                })}
                                className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded"
                                rows={3}
                                style={{ resize: 'vertical', maxWidth: '100%', maxHeight: 120 }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Industry <span className="text-red-500">*</span></label>
                            <select
                                {...register('industry', {
                                    required: 'Industry is required',
                                    onChange: (e) => handleFormChange('industry', e.target.value),
                                })}
                                className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded"
                            >
                                <option value="">Select industry</option>
                                {Industries.map((industry, i) => (
                                    <option key={i} value={industry}>{industry}</option>
                                ))}
                            </select>
                            {errors.industry && <span className="text-xs text-red-500">{errors.industry.message}</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Organization Size <span className="text-red-500">*</span></label>
                            <select
                                {...register('organizationSize', {
                                    required: 'Organization size is required',
                                    onChange: (e) => handleFormChange('organizationSize', e.target.value),
                                })}
                                className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded"
                            >
                                <option value="">Select size</option>
                                {OrganizationSizes.map((size, i) => (
                                    <option key={i} value={size}>{size}</option>
                                ))}
                            </select>
                            {errors.organizationSize && <span className="text-xs text-red-500">{errors.organizationSize.message}</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Organization Type <span className="text-red-500">*</span></label>
                            <select
                                {...register('organizationType', {
                                    required: 'Organization type is required',
                                    onChange: (e) => handleFormChange('organizationType', e.target.value),
                                })}
                                className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded"
                            >
                                <option value="">Select type</option>
                                {OrganizationTypes.map((type, i) => (
                                    <option key={i} value={type}>{type}</option>
                                ))}
                            </select>
                            {errors.organizationType && <span className="text-xs text-red-500">{errors.organizationType.message}</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Location <span className="text-red-500">*</span></label>
                            <Controller
                                name="location"
                                control={control}
                                rules={{ required: 'Location is required' }}
                                render={({ field }) => (
                                    <GooglePlacesAutocomplete {...field} />
                                )}
                            />
                            {errors.location && <span className="text-xs text-red-500">{errors.location.message}</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Website</label>
                            <input type="text" {...register('website')} className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded" />
                        </div>
                        <div className="flex gap-4 mt-6 flex-col sm:flex-row">
                            <button type="submit" className="bg-primary text-white px-6 py-2 rounded font-semibold flex-1" disabled={isSubmitting}>
                                {isSubmitting ? <Spinner /> : 'Create Business'}
                            </button>
                            <button type="button" className="bg-gray-200 text-gray-700 px-6 py-2 rounded font-semibold flex-1" onClick={handleSkip} disabled={isSubmitting}>
                                Skip for now
                            </button>
                        </div>
                    </form>
                </div>
                {/* Page Preview Section */}
                <div className="max-md:hidden flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center relative max-w-md min-w-[320px]">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden border-2 border-gray-300 shadow-sm">
                        {formPreview.logo ? (
                            <img src={formPreview.logo} alt="Logo Preview" className="w-full h-full object-cover" />
                        ) : (
                            <Image size={40} className="text-gray-400" />
                        )}
                    </div>
                    <div className="text-xl font-semibold text-gray-900 text-center min-h-[28px] truncate w-full max-w-xs mx-auto" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {formPreview.name || 'Company name'}
                    </div>
                    <div className="text-gray-500 text-center text-sm min-h-[20px] truncate w-full max-w-xs mx-auto" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {formPreview.tagline || 'Tagline'}
                    </div>
                    <div className="text-gray-400 text-center text-xs mt-1 min-h-[18px] truncate w-full max-w-xs mx-auto" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {formPreview.industry || 'Industry'}
                    </div>
                    <button className="mt-4 bg-primary text-white px-5 py-2 rounded font-semibold w-full max-w-[200px]">+ Follow</button>
                </div>
            </div>
        </div>
    );
};

export default AddBusiness;
