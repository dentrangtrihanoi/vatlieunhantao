"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';

import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    List, ListOrdered, Heading1, Heading2, Heading3,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Link as LinkIcon, Image as ImageIcon, Undo, Redo,
    Quote, Minus, Subscript as SubIcon, Superscript as SupIcon,
    Table as TableIcon, Highlighter, Baseline, Eraser, UploadCloud
} from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import cn from "@/utils/cn";

interface TiptapEditorProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    errMsg?: string;
}

const ToolbarButton = ({
    onClick,
    isActive = false,
    children,
    title,
    disabled = false,
}: {
    onClick: (e: React.MouseEvent) => void;
    isActive?: boolean;
    children: React.ReactNode;
    title?: string;
    disabled?: boolean;
}) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        disabled={disabled}
        className={cn(
            "p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700",
            isActive ? "bg-gray-200 text-blue font-bold" : "",
            disabled ? "opacity-50 cursor-not-allowed" : ""
        )}
    >
        {children}
    </button>
);

const TiptapEditor = ({
    label,
    value,
    onChange,
    required = false,
    errMsg,
}: TiptapEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Subscript,
            Superscript,
            TextStyle,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
            Link.configure({
                openOnClick: false,
            }),
            Image,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content: value,
        editorProps: {
            attributes: {
                class:
                    "prose max-w-none focus:outline-none min-h-[200px] px-4 py-3 bg-white",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Modal state for image insertion (replaces window.prompt)
    const [imageModal, setImageModal] = useState<{
        show: boolean;
        mode: "url" | "upload";
        url: string;
        alt: string;
        pendingUrl?: string; // for upload mode: url already resolved
    }>({ show: false, mode: "url", url: "", alt: "" });

    const openImageUrlModal = () => {
        setImageModal({ show: true, mode: "url", url: "", alt: "" });
    };

    const confirmImageModal = () => {
        const src = imageModal.mode === "upload" ? imageModal.pendingUrl! : imageModal.url.trim();
        if (!src) return;
        editor.chain().focus().setImage({ src, alt: imageModal.alt.trim() }).run();
        setImageModal({ show: false, mode: "url", url: "", alt: "" });
    };

    const cancelImageModal = () => {
        setImageModal({ show: false, mode: "url", url: "", alt: "" });
    };

    useEffect(() => {
        if (editor && value && editor.getHTML() !== value) {
            if (editor.getText() === "" && value !== "<p></p>") {
                editor.commands.setContent(value);
            }
        }
    }, [value, editor]);


    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);
        if (url === null) return;
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };

    const addImage = () => {
        openImageUrlModal();
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert("File quá lớn. Vui lòng chọn ảnh dưới 10MB.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            // Use fetch API route instead of server action to get proper error messages
            const response = await fetch("/api/upload-image", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();

            if (result.success && result.url) {
                setImageModal({ show: true, mode: "upload", url: "", alt: "", pendingUrl: result.url });
            } else {
                alert("Upload thất bại: " + (result.error || "Lỗi không xác định"));
            }
        } catch (error: any) {
            console.error("Upload error:", error);
            alert("Upload thất bại: Lỗi kết nối server");
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="w-full">
            <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
            />
            <label className="block mb-1.5 text-sm text-gray-6 capitalize">
                {label} {required && <span className="text-red">*</span>}
            </label>

            <div className="border border-gray-3 rounded-lg overflow-hidden bg-white shadow-sm">
                {/* Toolbar */}
                <div className="flex flex-col border-b border-gray-3 bg-gray-50">
                    <div className="flex flex-wrap items-center gap-1 p-2">
                        {/* History */}
                        <ToolbarButton
                            onClick={() => editor.chain().focus().undo().run()}
                            title="Undo"
                            disabled={!editor.can().undo()}
                        >
                            <Undo size={16} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().redo().run()}
                            title="Redo"
                            disabled={!editor.can().redo()}
                        >
                            <Redo size={16} />
                        </ToolbarButton>

                        <div className="w-px h-5 bg-gray-300 mx-1" />

                        {/* Formatting */}
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            isActive={editor.isActive("bold")}
                            title="Bold"
                        >
                            <Bold size={16} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            isActive={editor.isActive("italic")}
                            title="Italic"
                        >
                            <Italic size={16} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            isActive={editor.isActive("underline")}
                            title="Underline"
                        >
                            <UnderlineIcon size={16} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            isActive={editor.isActive("strike")}
                            title="Strikethrough"
                        >
                            <Strikethrough size={16} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleSubscript().run()}
                            isActive={editor.isActive("subscript")}
                            title="Subscript"
                        >
                            <SubIcon size={16} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleSuperscript().run()}
                            isActive={editor.isActive("superscript")}
                            title="Superscript"
                        >
                            <SupIcon size={16} />
                        </ToolbarButton>

                        {/* Colors */}
                        <div className="flex items-center gap-1 ml-1">
                            <input
                                type="color"
                                onInput={(event) => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
                                value={editor.getAttributes('textStyle').color || '#000000'}
                                className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
                                title="Text Color"
                            />
                            <ToolbarButton
                                onClick={() => editor.chain().focus().toggleHighlight().run()}
                                isActive={editor.isActive('highlight')}
                                title="Highlight"
                            >
                                <Highlighter size={16} />
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => editor.chain().focus().unsetAllMarks().run()}
                                title="Clear Format"
                            >
                                <Eraser size={16} />
                            </ToolbarButton>
                        </div>

                        <div className="w-px h-5 bg-gray-300 mx-1" />

                        {/* Headings */}
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            isActive={editor.isActive("heading", { level: 1 })}
                            title="Heading 1"
                        >
                            <Heading1 size={16} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            isActive={editor.isActive("heading", { level: 2 })}
                            title="Heading 2"
                        >
                            <Heading2 size={16} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            isActive={editor.isActive("heading", { level: 3 })}
                            title="Heading 3"
                        >
                            <Heading3 size={16} />
                        </ToolbarButton>


                        <div className="w-px h-5 bg-gray-300 mx-1" />

                        {/* Alignment */}
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign("left").run()}
                            isActive={editor.isActive({ textAlign: "left" })}
                            title="Align Left"
                        >
                            <AlignLeft size={16} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign("center").run()}
                            isActive={editor.isActive({ textAlign: "center" })}
                            title="Align Center"
                        >
                            <AlignCenter size={16} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign("right").run()}
                            isActive={editor.isActive({ textAlign: "right" })}
                            title="Align Right"
                        >
                            <AlignRight size={16} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                            isActive={editor.isActive({ textAlign: "justify" })}
                            title="Align Justify"
                        >
                            <AlignJustify size={16} />
                        </ToolbarButton>
                    </div>

                    <div className="flex flex-wrap items-center gap-1 border-t border-gray-3 p-2 bg-gray-50/50">
                        {/* Lists & Indents */}
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            isActive={editor.isActive("bulletList")}
                            title="Bullet List"
                        >
                            <List size={16} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            isActive={editor.isActive("orderedList")}
                            title="Ordered List"
                        >
                            <ListOrdered size={16} />
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            isActive={editor.isActive("blockquote")}
                            title="Blockquote"
                        >
                            <Quote size={16} />
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() => editor.chain().focus().setHorizontalRule().run()}
                            title="Horizontal Rule"
                        >
                            <Minus size={16} />
                        </ToolbarButton>

                        <div className="w-px h-5 bg-gray-300 mx-1" />

                        {/* Media & Table */}
                        <ToolbarButton
                            onClick={setLink}
                            isActive={editor.isActive("link")}
                            title="Link"
                        >
                            <LinkIcon size={16} />
                        </ToolbarButton>
                        <ToolbarButton onClick={addImage} title="Image URL">
                            <ImageIcon size={16} />
                        </ToolbarButton>
                        <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Upload Image">
                            <UploadCloud size={16} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                            title="Insert Table"
                        >
                            <TableIcon size={16} />
                        </ToolbarButton>
                        {editor.isActive('table') && (
                            <>
                                <button onClick={() => editor.chain().focus().deleteTable().run()} className="text-xs text-red-500 hover:underline ml-1">Del Table</button>
                                <button onClick={() => editor.chain().focus().addColumnAfter().run()} className="text-xs text-blue-500 hover:underline ml-1">+Col</button>
                                <button onClick={() => editor.chain().focus().addRowAfter().run()} className="text-xs text-blue-500 hover:underline ml-1">+Row</button>
                            </>
                        )}

                    </div>
                </div>

                {/* Content Area */}
                <EditorContent editor={editor} className="min-h-[250px]" />
            </div>

            {errMsg && <p className="text-sm text-red mt-1.5">{errMsg}</p>}

            {/* Image Insert Modal */}
            {imageModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-base font-semibold text-dark mb-4">
                            {imageModal.mode === "url" ? "Chèn ảnh từ URL" : "Điền alt text cho ảnh"}
                        </h3>

                        {imageModal.mode === "url" && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL ảnh <span className="text-red">*</span>
                                </label>
                                <input
                                    type="url"
                                    className="w-full rounded-lg border border-gray-3 px-3 py-2 text-sm text-dark outline-none focus:border-blue transition"
                                    placeholder="https://..."
                                    value={imageModal.url}
                                    onChange={(e) => setImageModal((prev) => ({ ...prev, url: e.target.value }))}
                                    autoFocus
                                />
                            </div>
                        )}

                        {imageModal.mode === "upload" && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <img src={imageModal.pendingUrl} alt="" className="max-h-32 rounded object-contain mx-auto" />
                            </div>
                        )}

                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Alt text (mô tả ảnh cho SEO)
                            </label>
                            <input
                                type="text"
                                maxLength={125}
                                className="w-full rounded-lg border border-gray-3 px-3 py-2 text-sm text-dark outline-none focus:border-blue transition"
                                placeholder="Mô tả nội dung ảnh, tối đa 125 ký tự"
                                value={imageModal.alt}
                                onChange={(e) => setImageModal((prev) => ({ ...prev, alt: e.target.value }))}
                                autoFocus={imageModal.mode === "upload"}
                            />
                            <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-400">Giúp tăng SEO và accessibility</span>
                                <span className="text-xs text-gray-400">{imageModal.alt.length}/125</span>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={cancelImageModal}
                                className="px-4 py-2 text-sm rounded-lg border border-gray-3 text-gray-600 hover:bg-gray-50 transition"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={confirmImageModal}
                                disabled={imageModal.mode === "url" && !imageModal.url.trim()}
                                className="px-4 py-2 text-sm rounded-lg bg-blue text-white hover:bg-blue-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Chèn ảnh
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TiptapEditor;
