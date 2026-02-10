import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prismaDB";
import { sendErrorResponse, sendSuccessResponse } from "@/utils/sendResponse";
import { revalidateTag } from "next/cache";
import { sendOrderConfirmationEmail } from "@/lib/emailService";
import { formatPrice } from "@/utils/formatePrice";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Missing Fields" }, { status: 400 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        billing: {
          path: ["email"],
          equals: session.user.email,
        },
      },
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { shipToDifferentAddress, couponDiscount, couponCode, products, ...orderData } = body;

    // Start a transaction to ensure atomic updates
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          ...orderData,
          products,
          couponDiscount,
        },
      });

      // Update product quantity
      for (const item of products) {
        const product = await tx.product.findUnique({
          where: { id: item.id },
          select: { quantity: true },
        });

        if (!product || product.quantity < item.quantity) {
          throw new Error(`Insufficient quantity for product: ${item.name}`);
        }

        await tx.product.update({
          where: { id: item.id },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      // If a coupon was applied, update its redemption count
      if (couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: couponCode },
        });
        if (!coupon) {
          throw new Error("Invalid coupon code");
        }
        if (coupon.timesRedemed >= coupon.maxRedemptions) {
          throw new Error("Coupon has reached its maximum redemptions");
        }
        await tx.coupon.update({
          where: { code: couponCode },
          data: {
            timesRedemed: { increment: 1 },
          },
        });
      }

      return newOrder;
    });
    // Send order confirmation email (wrapped in try-catch to prevent email failures from affecting order creation)
    if (order.id) {
      // Create custom order ID with DHTS prefix
      // Fallback to order.id if orderNumber is somehow undefined (e.g. stale client)
      const orderAny = order as any;
      const displayId = orderAny.orderNumber ? `DHTS${orderAny.orderNumber}` : order.id;

      try {
        await sendOrderConfirmationEmail({
          to: orderData.billing.email,
          orderNumber: displayId,
          customerName: orderData.billing?.firstName + " " + orderData.billing?.lastName || "Customer",
          orderDate: new Date().toLocaleDateString(),
          totalAmount: order.totalAmount,
          orderItems: products.map((product: any) => ({
            name: product.name,
            quantity: product.quantity,
            price: product.price,
          })),
          shippingAddress: {
            name: orderData?.shipping?.email || orderData.billing?.email,
            address: orderData?.shipping?.address?.street || orderData.billing?.address?.street,
            city: orderData?.shipping?.town || orderData.billing?.town,
            country: orderData?.shipping?.country || orderData.billing?.country,
          },
        });

        // Send notification to admin
        const adminEmail = process.env.ADMIN_EMAILS || process.env.EMAIL_FROM;
        if (adminEmail) {
          const { sendEmail } = await import("@/lib/email");

          // Build product rows for table
          const productRows = products
            .map(
              (p: any) => `
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${p.name}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${p.quantity}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatPrice(p.price)}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${formatPrice(p.price * p.quantity)}</td>
                </tr>
              `
            )
            .join("");

          await sendEmail({
            to: adminEmail,
            subject: `🛒 [Đơn hàng mới] #${displayId} - ${formatPrice(order.totalAmount)}`,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
                  <tr>
                    <td align="center">
                      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        
                        <!-- Header -->
                        <tr>
                          <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">🎉 Đơn Hàng Mới!</h1>
                            <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">Bạn có đơn hàng mới từ website</p>
                          </td>
                        </tr>
                        
                        <!-- Order Info -->
                        <tr>
                          <td style="padding: 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
                              <tr>
                                <td>
                                  <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Mã đơn hàng</p>
                                  <p style="margin: 0; color: #111827; font-size: 24px; font-weight: 700;">#${displayId}</p>
                                </td>
                                <td align="right">
                                  <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Tổng tiền</p>
                                  <p style="margin: 0; color: #10b981; font-size: 24px; font-weight: 700;">${formatPrice(order.totalAmount)}</p>
                                </td>
                              </tr>
                            </table>
                            
                            <!-- Customer Info -->
                            <h2 style="margin: 0 0 15px 0; color: #111827; font-size: 18px; font-weight: 600; border-bottom: 2px solid #667eea; padding-bottom: 8px;">👤 Thông tin khách hàng</h2>
                            <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 25px;">
                              <tr>
                                <td style="color: #6b7280; font-size: 14px; width: 140px;">Họ và tên:</td>
                                <td style="color: #111827; font-size: 14px; font-weight: 600;">${orderData.billing?.firstName}</td>
                              </tr>
                              <tr>
                                <td style="color: #6b7280; font-size: 14px;">Email:</td>
                                <td style="color: #111827; font-size: 14px; font-weight: 600;">${orderData.billing?.email}</td>
                              </tr>
                              <tr>
                                <td style="color: #6b7280; font-size: 14px;">Số điện thoại:</td>
                                <td style="color: #111827; font-size: 14px; font-weight: 600;">${orderData.billing?.phone}</td>
                              </tr>
                              <tr>
                                <td style="color: #6b7280; font-size: 14px; vertical-align: top;">Địa chỉ:</td>
                                <td style="color: #111827; font-size: 14px; font-weight: 600;">${orderData.billing?.address?.street}</td>
                              </tr>
                              <tr>
                                <td style="color: #6b7280; font-size: 14px;">Thanh toán:</td>
                                <td>
                                  <span style="display: inline-block; background-color: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 600;">
                                    ${orderData.paymentMethod === "cod" ? "💵 COD (Thanh toán khi nhận hàng)" : orderData.paymentMethod}
                                  </span>
                                </td>
                              </tr>
                            </table>
                            
                            <!-- Products Table -->
                            <h2 style="margin: 0 0 15px 0; color: #111827; font-size: 18px; font-weight: 600; border-bottom: 2px solid #667eea; padding-bottom: 8px;">📦 Sản phẩm</h2>
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; margin-bottom: 20px;">
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
                            
                            ${orderData.notes ? `
                            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin-top: 20px;">
                              <p style="margin: 0 0 5px 0; color: #92400e; font-size: 13px; font-weight: 600; text-transform: uppercase;">📝 Ghi chú từ khách hàng:</p>
                              <p style="margin: 0; color: #78350f; font-size: 14px;">${orderData.notes}</p>
                            </div>
                            ` : ""}
                          </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                          <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; color: #6b7280; font-size: 13px;">Email này được gửi tự động từ hệ thống</p>
                            <p style="margin: 5px 0 0 0; color: #9ca3af; font-size: 12px;">Vui lòng liên hệ khách hàng để xác nhận đơn hàng</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
              </html>
            `,
          });
        }
      } catch (emailError: any) {
        // Log email error but don't fail the order creation
        console.error("Failed to send order confirmation email:", emailError?.message || emailError);
        // Order was created successfully, so we still return success
      }
    }

    revalidateTag("orders", { expire: 0 });
    return sendSuccessResponse(200, "Order created successfully", order);
  } catch (err: any) {
    console.log(err?.stack || err);
    return sendErrorResponse(500, err.message || "Internal Server Error");
  }
}

