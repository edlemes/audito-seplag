import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import FeedbackForm from "@/components/portal/FeedbackForm";

const Avaliacao = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <div className="flex-1 py-10">
      <div className="container mx-auto px-4">
        <FeedbackForm />
      </div>
    </div>
    <Footer />
  </div>
);

export default Avaliacao;
