import TopBar from "@/components/website/TopBar/TopBar";
import Navbar from "@/components/website/Navbar/Navbar";
import Footer from "@/components/website/Footer/Footer";
import ChatBot from "@/components/website/ChatBot/ChatBot";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBar />
      <Navbar />
      <main>{children}</main>
      <ChatBot />
      <Footer />
    </>
  );
}
