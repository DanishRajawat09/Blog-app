import BlogList from "../components/HomeComponents/BlogList";
import Hero from "../components/HomeComponents/Hero";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero/>
      <BlogList/>
    </>
  );
};

export default Home;
