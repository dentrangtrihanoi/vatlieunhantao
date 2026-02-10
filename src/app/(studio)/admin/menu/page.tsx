"use client";

import React, { useState, useEffect } from "react";
import MenuForm from "./_components/MenuForm";
import { useRouter } from "next/navigation";

export default function MenuPage() {
    const router = useRouter();
    const [menus, setMenus] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const fetchMenus = async () => {
        try {
            const res = await fetch("/api/menu");
            const data = await res.json();
            setMenus(data);
        } catch (error) {
            console.error("Failed to fetch menus", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, [isEditing]); // Refetch when closing edit mode

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            await fetch(`/api/menu/${id}`, {
                method: "DELETE",
            });
            fetchMenus();
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to delete");
        }
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setEditingItem(null);
        setIsEditing(true);
    };

    // Flatten menus to get potential parents (only root items can be parents for now, or 1 level deep)
    // Logic: root items are parents. 
    // If we want deeper nesting, we need a recursive structure. 
    // For simplicity, let's just allow root items to be parents.
    const parentOptions = menus.filter(m => !m.parentId);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
                {!isEditing && (
                    <button
                        onClick={handleAddNew}
                        className="px-4 py-2 text-white bg-blue rounded hover:bg-blue-dark font-medium shadow-sm"
                    >
                        Add New Item
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="max-w-lg">
                    <h2 className="mb-4 text-xl font-semibold">
                        {editingItem ? "Edit Menu Item" : "New Menu Item"}
                    </h2>
                    <MenuForm
                        initialData={editingItem}
                        parents={parentOptions} // Pass only root items as parents to avoid deep nesting complexity for now
                        onSuccess={() => {
                            setIsEditing(false);
                            fetchMenus();
                        }}
                        onCancel={() => setIsEditing(false)}
                    />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Path
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Order
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {menus.map((menu) => (
                                <React.Fragment key={menu.id}>
                                    {/* Root Item */}
                                    <tr className="bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                            {menu.title}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {menu.path}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {menu.order}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(menu)}
                                                className="mr-3 text-indigo-600 hover:text-indigo-900"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(menu.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                    {/* Children Items */}
                                    {menu.children?.map((child: any) => (
                                        <tr key={child.id} className="bg-white">
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap pl-12">
                                                ↳ {child.title}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                {child.path}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                {child.order}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => handleEdit(child)}
                                                    className="mr-3 text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(child.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
