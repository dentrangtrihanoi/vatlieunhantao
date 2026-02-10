import {
  Body,
  Container,
  Head,
  Html,
  Preview,
} from "@react-email/components";
import * as React from "react";
import { formatPrice } from "../utils/formatePrice";

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  orderItems: {
    name: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    country: string;
  };
  siteName: string;
  logoUrl: string;
  supportEmail: string;
}

export const OrderConfirmationEmail = ({
  orderNumber,
  customerName,
  orderDate,
  totalAmount,
  orderItems,
  shippingAddress,
  siteName,
  logoUrl,
  supportEmail,
}: OrderConfirmationEmailProps) => {
  const currentYear = new Date().getFullYear();

  // Build product rows
  const productRows = orderItems
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatPrice(item.price)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${formatPrice(item.price * item.quantity)}</td>
        </tr>
      `
    )
    .join("");

  return (
    <Html>
      <Head />
      <Preview>Xác nhận đơn hàng #${orderNumber} - Cảm ơn bạn đã đặt hàng!</Preview>
      <Body style={main}>
        <Container style={container}>
          <div
            dangerouslySetInnerHTML={{
              __html: `
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
                  <tr>
                    <td align="center">
                      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        
                        <!-- Header -->
                        <tr>
                          <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center;">
                            <img src="${logoUrl}" alt="${siteName}" width="120" style="margin-bottom: 20px;" />
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">✅ Đặt hàng thành công!</h1>
                            <p style="margin: 10px 0 0 0; color: #d1fae5; font-size: 16px;">Cảm ơn bạn đã tin tưởng ${siteName}</p>
                          </td>
                        </tr>
                        
                        <!-- Greeting -->
                        <tr>
                          <td style="padding: 30px 30px 20px 30px;">
                            <p style="margin: 0; color: #111827; font-size: 16px; line-height: 1.6;">Xin chào <strong>${customerName}</strong>,</p>
                            <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 15px; line-height: 1.6;">
                              Chúng tôi đã nhận được đơn hàng của bạn và đang xử lý. Dưới đây là thông tin chi tiết đơn hàng:
                            </p>
                          </td>
                        </tr>
                        
                        <!-- Order Summary Box -->
                        <tr>
                          <td style="padding: 0 30px 20px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 8px; padding: 20px; border: 2px solid #10b981;">
                              <tr>
                                <td>
                                  <p style="margin: 0 0 8px 0; color: #059669; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Mã đơn hàng</p>
                                  <p style="margin: 0; color: #065f46; font-size: 28px; font-weight: 700;">#${orderNumber}</p>
                                </td>
                                <td align="right">
                                  <p style="margin: 0 0 8px 0; color: #059669; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Tổng tiền</p>
                                  <p style="margin: 0; color: #065f46; font-size: 28px; font-weight: 700;">${formatPrice(totalAmount)}</p>
                                </td>
                              </tr>
                              <tr>
                                <td colspan="2" style="padding-top: 15px;">
                                  <p style="margin: 0; color: #059669; font-size: 14px;">
                                    <strong>Ngày đặt:</strong> ${orderDate}
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        
                        <!-- Products Table -->
                        <tr>
                          <td style="padding: 0 30px 25px 30px;">
                            <h2 style="margin: 0 0 15px 0; color: #111827; font-size: 18px; font-weight: 600; border-bottom: 2px solid #10b981; padding-bottom: 8px;">📦 Sản phẩm đã đặt</h2>
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
                              <thead>
                                <tr style="background-color: #f9fafb;">
                                  <th style="padding: 12px; text-align: left; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Sản phẩm</th>
                                  <th style="padding: 12px; text-align: center; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">SL</th>
                                  <th style="padding: 12px; text-align: right; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Đơn giá</th>
                                  <th style="padding: 12px; text-align: right; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Thành tiền</th>
                                </tr>
                              </thead>
                              <tbody>
                                ${productRows}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        
                        <!-- Shipping Address -->
                        <tr>
                          <td style="padding: 0 30px 25px 30px;">
                            <h2 style="margin: 0 0 15px 0; color: #111827; font-size: 18px; font-weight: 600; border-bottom: 2px solid #10b981; padding-bottom: 8px;">🚚 Địa chỉ giao hàng</h2>
                            <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981;">
                              <p style="margin: 0; color: #111827; font-size: 15px; line-height: 1.6;">
                                <strong>${shippingAddress.name}</strong><br/>
                                ${shippingAddress.address}<br/>
                                ${shippingAddress.city}${shippingAddress.country ? `, ${shippingAddress.country}` : ''}
                              </p>
                            </div>
                          </td>
                        </tr>
                        
                        <!-- Next Steps -->
                        <tr>
                          <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 20px;">
                              <p style="margin: 0 0 10px 0; color: #1e40af; font-size: 15px; font-weight: 600;">📞 Bước tiếp theo:</p>
                              <p style="margin: 0; color: #1e3a8a; font-size: 14px; line-height: 1.6;">
                                Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng và thỏa thuận về phương thức thanh toán, vận chuyển.
                              </p>
                            </div>
                          </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                          <td style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                              Cần hỗ trợ? Liên hệ: <a href="mailto:${supportEmail}" style="color: #10b981; text-decoration: none; font-weight: 600;">${supportEmail}</a>
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                              © ${currentYear} ${siteName}. All rights reserved.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              `,
            }}
          />
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f3f4f6",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "0",
};

export default OrderConfirmationEmail; 