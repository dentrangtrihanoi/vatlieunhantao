import AboutForm from "./_components/AboutForm";
import { getAboutUsData } from "@/get-api-data/about";


export default async function AboutPage() {
    const aboutData = await getAboutUsData();
    return (
        <div className="max-w-5xl mx-auto bg-white border rounded-xl shadow-1 border-gray-3">
            <div className="flex flex-col justify-between gap-4 px-6 py-5 border-b sm:items-center sm:flex-row border-gray-3">
                <h2 className="text-base font-semibold text-dark">Introduction (About Us)</h2>
            </div>
            <div className="p-6">
                <AboutForm aboutItem={aboutData[0] || null} />
            </div>
        </div>
    );
}
