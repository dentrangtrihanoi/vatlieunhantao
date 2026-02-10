"use server";

import { sendEmail } from "@/lib/email";
import { errorResponse, successResponse } from "@/lib/response";

export async function sendContactFormEmail(data: {
    firstName: string;
    lastName: string;
    subject: string;
    phone: string;
    message: string;
}) {
    try {
        const { firstName, lastName, subject, phone, message } = data;

        if (!firstName || !lastName || !subject || !phone || !message) {
            return errorResponse(400, "Vui lòng điền đầy đủ thông tin.");
        }

        const adminEmail = process.env.ADMIN_EMAILS || process.env.EMAIL_FROM;

        if (!adminEmail) {
            console.error("ADMIN_EMAILS or EMAIL_FROM is not defined in .env");
            return errorResponse(500, "Lỗi cấu hình hệ thống: Không tìm thấy email quản trị viên.");
        }

        const htmlContent = `
      <h2>Tin nhắn liên hệ mới từ Website</h2>
      <p><strong>Họ tên:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email/SĐT:</strong> ${phone}</p>
      <p><strong>Chủ đề:</strong> ${subject}</p>
      <p><strong>Nội dung:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `;

        await sendEmail({
            to: adminEmail,
            subject: `[Contact Form] ${subject} - ${firstName} ${lastName}`,
            html: htmlContent,
        });

        return successResponse(200, "Gửi tin nhắn thành công!");
    } catch (error: any) {
        console.error("Error sending contact email:", error);
        return errorResponse(500, "Gửi tin nhắn thất bại. Vui lòng thử lại sau.");
    }
}
