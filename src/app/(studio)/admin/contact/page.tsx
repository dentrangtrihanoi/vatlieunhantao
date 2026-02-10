import { getContactPage } from "@/get-api-data/contact";
import ContactForm from "./_components/ContactForm";

export default async function ContactAdminPage() {
    const contactData = await getContactPage();
    return (
        <div className="max-w-5xl mx-auto bg-white border rounded-xl shadow-1 border-gray-3">
            <div className="flex flex-col justify-between gap-4 px-6 py-5 border-b sm:items-center sm:flex-row border-gray-3">
                <h2 className="text-base font-semibold text-dark">Contact Page Customization</h2>
            </div>
            <div className="p-6">
                <ContactForm contactItem={contactData[0] || null} />
            </div>
        </div>
    );
}
