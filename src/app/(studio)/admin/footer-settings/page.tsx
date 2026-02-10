"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { getFooterSettings, updateFooterSettings } from "@/app/actions/footer-setting";
import Loader from "@/components/Common/Loader";
import Breadcrumb from "@/components/Common/Breadcrumb";

type QuickLink = {
    label: string;
    url: string;
};

type FormData = {
    companyName: string;
    address: string;
    email: string;
    phone: string;
    facebookLink: string;
    twitterLink: string;
    instagramLink: string;
    linkedinLink: string;
    pinterestLink: string;
    mapIframe: string;
};

const FooterSettings = () => {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);

    const { register, handleSubmit, setValue, reset } = useForm<FormData>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getFooterSettings();
                if (res.success && res.data) {
                    const data = res.data;

                    setValue("companyName", data.companyName || "");
                    setValue("address", data.address || "");
                    setValue("email", data.email || "");
                    setValue("phone", data.phone || "");

                    setValue("facebookLink", data.facebookLink || "");
                    setValue("twitterLink", data.twitterLink || "");
                    setValue("instagramLink", data.instagramLink || "");
                    setValue("linkedinLink", data.linkedinLink || "");
                    setValue("pinterestLink", data.pinterestLink || "");

                    setValue("mapIframe", data.mapIframe || "");

                    if (data.quickLinks) {
                        try {
                            // Handle Prisma Json type which might be returned as object or string depending on client setting
                            const links = typeof data.quickLinks === 'string' ? JSON.parse(data.quickLinks) : data.quickLinks;
                            if (Array.isArray(links)) {
                                setQuickLinks(links);
                            }
                        } catch (error) {
                            console.error("Failed to parse quickLinks", error);
                        }
                    }
                }
            } catch (error) {
                toast.error("Failed to fetch footer settings");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [setValue]);

    const handleAddLink = () => {
        setQuickLinks([...quickLinks, { label: "", url: "" }]);
    };

    const handleLinkChange = (index: number, field: keyof QuickLink, value: string) => {
        const newLinks = [...quickLinks];
        newLinks[index][field] = value;
        setQuickLinks(newLinks);
    };

    const handleRemoveLink = (index: number) => {
        setQuickLinks(quickLinks.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: FormData) => {
        setUpdating(true);
        const formData = new FormData();

        // Append simple fields
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        // Append quickLinks as JSON string
        formData.append("quickLinks", JSON.stringify(quickLinks));

        try {
            const res = await updateFooterSettings(formData);
            if (res.success) {
                toast.success("Footer settings updated successfully");
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <>
            <Breadcrumb
                title="Footer Settings"
                items={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "Footer Settings", href: "/admin/footer-settings" },
                ]}
            />

            <div className="rounded-[10px] bg-white shadow-1">
                <div className="border-b px-7 py-4 border-gray-3">
                    <h3 className="font-medium text-dark">
                        Footer Configuration
                    </h3>
                </div>

                <div className="p-7">
                    <form onSubmit={handleSubmit(onSubmit)}>

                        {/* Column 1: Company Info */}
                        <div className="mb-8">
                            <h4 className="mb-4 text-xl font-semibold text-dark">1. Company Information (Column 1)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <InputGroup label="Company Name" register={register} name="companyName" placeholder="Cozy Commerce" />
                                <InputGroup label="Phone Number" register={register} name="phone" placeholder="+1234567890" />
                                <InputGroup label="Email" register={register} name="email" placeholder="support@example.com" />
                                <InputGroup label="Address" register={register} name="address" placeholder="123 Street, City, Country" />
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="mb-8">
                            <h4 className="mb-4 text-xl font-semibold text-dark">Social Media Links</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <InputGroup label="Facebook URL" register={register} name="facebookLink" placeholder="https://facebook.com/..." />
                                <InputGroup label="Twitter (X) URL" register={register} name="twitterLink" placeholder="https://twitter.com/..." />
                                <InputGroup label="Instagram URL" register={register} name="instagramLink" placeholder="https://instagram.com/..." />
                                <InputGroup label="LinkedIn URL" register={register} name="linkedinLink" placeholder="https://linkedin.com/..." />
                                <InputGroup label="Pinterest URL" register={register} name="pinterestLink" placeholder="https://pinterest.com/..." />
                            </div>
                        </div>

                        {/* Column 2: Quick Links */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-xl font-semibold text-dark">2. Quick Links (Column 2)</h4>
                                <button type="button" onClick={handleAddLink} className="text-white text-sm bg-blue px-3 py-1.5 rounded hover:bg-blue-dark">
                                    + Add Link
                                </button>
                            </div>

                            {quickLinks.length === 0 && <p className="text-gray-500 italic">No links added yet.</p>}

                            <div className="space-y-3">
                                {quickLinks.map((link, index) => (
                                    <div key={index} className="flex gap-4 items-end bg-gray-1 p-4 rounded border border-gray-3">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-dark mb-1">Label</label>
                                            <input
                                                type="text"
                                                value={link.label}
                                                onChange={(e) => handleLinkChange(index, "label", e.target.value)}
                                                placeholder="e.g. About Us"
                                                className="w-full rounded-lg border-[1.5px] border-gray-3 px-3 py-2 text-dark outline-none transition focus:border-blue active:border-blue disabled:cursor-default disabled:bg-gray-2"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-dark mb-1">URL</label>
                                            <input
                                                type="text"
                                                value={link.url}
                                                onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                                                placeholder="e.g. /about or https://..."
                                                className="w-full rounded-lg border-[1.5px] border-gray-3 px-3 py-2 text-dark outline-none transition focus:border-blue active:border-blue disabled:cursor-default disabled:bg-gray-2"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveLink(index)}
                                            className="text-red hover:underline mb-2"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Column 3: Google Map */}
                        <div className="mb-8">
                            <h4 className="mb-4 text-xl font-semibold text-dark">3. Google Map (Column 3)</h4>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-dark mb-2">Embed Map Iframe Code</label>
                                <textarea
                                    {...register("mapIframe")}
                                    rows={5}
                                    placeholder="<iframe src='https://www.google.com/maps/embed?...' ...></iframe>"
                                    className="w-full rounded-lg border-[1.5px] border-gray-3 px-5 py-3 text-dark outline-none transition focus:border-blue active:border-blue disabled:cursor-default disabled:bg-gray-2"
                                ></textarea>
                                <p className="text-xs text-gray-500 mt-2">Go to Google Maps → Share → Embed a map → Copy HTML.</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={updating}
                            className="flex w-full justify-center rounded-md bg-blue p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
                        >
                            {updating ? "Updating..." : "Save Changes"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

const InputGroup = ({ label, register, name, placeholder, type = "text" }: any) => (
    <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-dark">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            {...register(name)}
            className="w-full rounded-lg border-[1.5px] border-gray-3 px-5 py-3 text-dark outline-none transition focus:border-blue active:border-blue disabled:cursor-default disabled:bg-gray-2"
        />
    </div>
);

export default FooterSettings;
