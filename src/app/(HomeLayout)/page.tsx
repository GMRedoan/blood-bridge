import { Banner } from "@/components/home/Banner";
import About from "./about/page";
import Faq from "@/components/home/Faq";
import BloodCompatibility from "@/components/home/BloodCompatiblity";
import FinalCta from "@/components/home/FinalCta";

const page = () => {
    return (
        <div>
            <Banner />
            <About />
            <BloodCompatibility/>
            <Faq/>
            <FinalCta/>
        </div>
    );
};

export default page;