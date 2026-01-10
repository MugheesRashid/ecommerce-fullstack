import React, { useState, useEffect, useContext } from "react";
import { Search, Store, SendHorizontal, Shield, Loader } from "lucide-react";
import { UserContextData } from "../assets/context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import ProductAPIService from "../services/productAPI";

function Landing() {
  const { user } = useContext(UserContextData);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await ProductAPIService.getAllProducts(1, 100);
        
        let productList = [];
        if (Array.isArray(response)) {
          productList = response;
        } else if (response?.data && Array.isArray(response.data)) {
          productList = response.data;
        } else if (response?.products && Array.isArray(response.products)) {
          productList = response.products;
        }

        setProducts(productList.slice(0, 5));
        setRecommendedProducts(productList.slice(0, 10));
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="section1 w-full h-[30vh] md:h-[60vh] flex flex-row bg-white justify-center items-center p-0 md:p-2 border border-solid border-[#DEE2E7] mt-5">
        <div className="left w-[24%] h-full px-5 font-light hidden md:flex flex-col justify-between">
          <p 
            className="bg-[#E5F1FF] px-2 py-2 font-medium rounded-lg cursor-pointer hover:bg-blue-200"
            onClick={() => navigate('/products')}
          >
            All Category
          </p>
          <p className="px-2 py-2 cursor-pointer hover:text-blue-600" onClick={() => navigate('/products?category=electronics')}>Electronics</p>
          <p className="px-2 py-2 cursor-pointer hover:text-blue-600" onClick={() => navigate('/products?category=clothing')}>Clothing</p>
          <p className="px-2 py-2 cursor-pointer hover:text-blue-600" onClick={() => navigate('/products?category=furniture')}>Furniture</p>
          <p className="px-2 py-2 cursor-pointer hover:text-blue-600" onClick={() => navigate('/products?category=accessories')}>Accessories</p>
          <p className="px-2 py-2 cursor-pointer hover:text-blue-600" onClick={() => navigate('/products?category=other')}>Other</p>
        </div>
        <div className="mid bg-[url('./landing/hero_sec.png')] text-[#222] tracking-tighter flex flex-col items-start gap-1 p-10 bg-center bg-cover bg-no-repeat w-full md:w-[56%] h-full">
          <p className="text-[25px] md:text-[1.4vw] leading-none ">
            Latest Trending
          </p>
          <h2 className="text-[30px] md:text-[3vw] leading-none font-bold">
            Electronic items
          </h2>
          <button 
            onClick={() => navigate('/products')}
            className="px-4 py-2 text-blue-500 bg-white mt-3 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            Shop Now
          </button>
        </div>
        <div className="right w-[20%] h-full hidden md:flex flex-col justify-around items-center">

           <div className="w-[90%] h-[40%] bg-[#E3F0FF] rounded-lg p-2 flex flex-col justify-between">
            <div className="user flex flex-row items-center gap-2">
              {" "}
              <img
                src="/ppf.webp"
                className="w-[4.3vw] h-[4.3vw] rounded-full"
                alt=""
              />
              <p className="flex flex-col items-start justify-center">
                <span>Hi {user?.fullname || "User"}</span>
                <span>Lets get started</span>
              </p>
            </div>
            {!isLoggedIn && (
              <Link to="/auth" className="w-full text-center py-1.5 text-[13px] rounded-lg font-medium text-white bg-blue-500 mb-1">
                Join Now
              </Link>
            )}
            {!isLoggedIn && (
              <Link to="/auth" className="w-full text-center py-1.5 text-[13px] rounded-lg font-medium bg-white text-blue-500">
                Login Now
              </Link>
            )}
            {isLoggedIn && (
              <Link to="/user" className="w-full text-center py-1.5 text-[13px] rounded-lg font-medium bg-white text-blue-500">
                Profile
              </Link>
            )}
          </div>
          
          <div className="w-[90%] h-[27%] bg-[#F38332] p-4 text-white rounded-lg">
            Get US $10 off with a new supplier
          </div>
          <div className="w-[90%] h-[27%] bg-[#55BDC3] p-4 text-white rounded-lg">
            Send quotes with supplier preferences
          </div>
        </div>
      </div>
      <div className="section2 h-[35vh] mb-5 w-full flex flex-col md:flex-row mt-5 border border-solid border-[#DEE2E7]">
        <div className="left w-full md:w-[23%] border-r border-solid flex justify-between md:justify-center md:flex-col flex-row border-[#DEE2E7]">
          <div className="txt flex flex-col justify-center text-[#1c1c1c] -gap-1 p-4">
            <p className="text-[20px] font-medium leading-none">
              Deals and Offers
            </p>
            <p className="text-[14px] font-light text-[#8B96A5]">
              Hygiene equipments
            </p>
          </div>
          <div className="dates flex flex-row justify-center gap-1 p-4 text-white">
            <p className="hidden md:flex flex-col items-center justify-center bg-[#606060] rounded-lg px-2 py-1">
              <span className="font-bold text-[20px] leading-none">04</span>
              <span className="text-[10px]">Day</span>
            </p>
            <p className="flex flex-col items-center justify-center bg-[#606060] rounded-lg px-2 py-1">
              <span className="font-bold text-[20px] leading-none">04</span>
              <span className="text-[10px]">hours</span>
            </p>

            <p className="flex flex-col items-center justify-center bg-[#606060] rounded-lg px-2 py-1">
              <span className="font-bold text-[20px] leading-none">04</span>
              <span className="text-[10px]">min</span>
            </p>
            <p className="flex flex-col items-center justify-center bg-[#606060] rounded-lg px-2 py-1">
              <span className="font-bold text-[20px] leading-none">04</span>
              <span className="text-[10px]">sec</span>
            </p>
          </div>
        </div>
        <div className="right flex flex-row w-full md:w-[77%] whitespace-nowrap overflow-x-auto">
          {products.length > 0 ? (
            products.map((product, index) => {
              const productImage = product.image?.startsWith('http') 
                ? product.image 
                : './product/' + product.image;
              return (
                <div 
                  key={product._id || index} 
                  className="item border-r border-[#DEE2E7] border-solid w-1/2 h-full flex flex-col justify-center items-center gap-2 p-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/product/${product._id || product.id}`)}
                >
                  <img src={productImage} alt={product.name} className="w-20 h-20 md:w-24 md:h-24 object-contain" />
                  <h1 className="text-sm text-center">{product.name.substring(0, 15)}...</h1>
                  <p className="bg-red-200 text-red-500 px-2 py-1 rounded-full text-xs">
                    -{Math.floor((((product.price - (product.discountedPrice || product.price)) / product.price) * 100))}%
                  </p>
                </div>
              );
            })
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Loader className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          )}
        </div>
      </div>
      <div className="section3 mb-5 h-[30vh] md:h-[40vh] w-full flex mt-3 flex-col md:flex-row border border-solid border-[#DEE2E7]">
        <div className="relative md:flex hidden left w-[23%] border-r border-[#DEE2E7] bg-[url('./landing/hero2.jpg')] bg-cover bg-center">
          <div className="absolute z-10 inset-0 bg-[#FFE8BA]/40"></div>
          <div className="txt z-20 relative flex flex-col justify-center items-start -gap-1 p-4">
            <p className="text-[20px] w-full md:w-3/4 font-semibold leading-none">
              Deals and Offers
            </p>
            <button className="px-4 py-2 bg-white mt-3 rounded-lg">
              Shop Now
            </button>
          </div>
        </div>
        <h3 className="md:hidden block py-2 h-[20%] text-[20px] font-medium px-3">
          Home and outdoor
        </h3>
        <div className="right h-[60%] md:h-full whitespace-nowrap md:whitespace-normal w-full md:w-[77%] flex flex-col md:flex-row flex-wrap border-r border-solid border-[#DEE2E7]">
          {products.length > 0 ? (
            products.slice(0, 8).map((product, index) => {
              const productImage = product.image?.startsWith('http') 
                ? product.image 
                : './product/' + product.image;
              return (
                <div
                  key={product._id || index}
                  className="w-1/4 h-full md:h-1/2 border border-solid border-[#DEE2E7] relative p-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/product/${product._id || product.id}`)}
                >
                  <h2 className="text-[#222] mb-2 text-sm font-medium">{product.name.substring(0, 12)}</h2>
                  <p className="flex text-[13px] text-[#8B96A5] leading-none flex-col items-start">
                    <span>From</span> USD {product.discountedPrice || product.price}
                  </p>
                  <img
                    src={productImage}
                    className="absolute right-2 bottom-2 w-16 h-16 md:w-20 md:h-20 object-contain"
                    alt={product.name}
                  />
                </div>
              );
            })
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Loader className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          )}
        </div>
        <p className="h-[20%] block md:hidden text-[24px] w-full text-blue-500 px-3 py-3">
          Source Now
        </p>
      </div>
      <div className="section4 w-full md:h-[70vh] h-[30vh] bg-[url('./landing/hero3.png')] bg-center bg-cover bg-no-repeat flex flex-row items-start justify-between mb-10 p-10">
        <div className="flex flex-col gap-4 text-white">
          <h3 className="text-[7vw] md:text-[2.2vw] leading-none font-semibold md:w-2/3 w-full">
            An easy way to send requests to all suppliers
          </h3>
          <p className="text-[1vw] hidden md:block w-full md:w-2/3">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt.
          </p>
          <button className="px-1 py-2 w-1/3 md:w-auto md:hidden cursor-pointer bg-blue-600 text-white font-medium rounded-lg">
            Send Inquiry
          </button>
        </div>
        <div className="form rounded-lg hidden md:flex flex-col px-5 py-10 gap-3 items-start justify-between bg-white h-full w-1/2">
          <p className="text-[1.5vw] tracking-tight font-semibold mb-1">
            Send qoute to suppliers
          </p>
          <input
            className="w-[90%] px-2 py-3 border border-solid border-[#DEE2E7] rounded-md outline-none placeholder:text-[#000]"
            type="text"
            placeholder="What items you need?"
          />
          <textarea
            className="resize-none p-2 w-full h-[15vh] border border-solid border-[#DEE2E7] rounded-md outline-none"
            placeholder="Type more details"
            name=""
            id=""
          ></textarea>
          <div className="flex flex-row justify-start items-center gap-3">
            <input
              className="w-3/4 px-3 py-2 border border-solid border-[#DEE2E7] rounded-md outline-none"
              placeholder="Quantity"
              type="number"
              name=""
              id=""
            />
            <select
              className="w-1/4 px-3 py-2 border border-solid border-[#DEE2E7] rounded-md outline-none"
              name=""
              id=""
            >
              <option value="Pcs">Pcs</option>
              <option value="Kg">Kg</option>
            </select>
          </div>
          <button className="px-3 py-2 cursor-pointer bg-blue-600 text-white font-semibold rounded-lg">
            Send Inquiry
          </button>
        </div>
      </div>
      <div className="section5 mb-10 md:px-0 p-3">
        <h3 className="mb-5 font-bold text-[5vw] md:text-[1.5vw]">
          Recommended Items
        </h3>
        <div className="w-full h-auto columns-2 md:columns-5 overflow-hidden">
          {recommendedProducts.length > 0 ? (
            recommendedProducts.map((product, index) => {
              const productImage = product.image?.startsWith('http') 
                ? product.image 
                : './product/' + product.image;
              return (
                <div 
                  key={product._id || index} 
                  className="item mb-5 h-[40vh] md:h-[50vh] bg-white border border-solid border-[#DEE2E7] flex flex-col py-1 justify-center items-start px-2 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/product/${product._id || product.id}`)}
                >
                  {/* <div className="w-full bg-center bg-cover bg-no-repeat h-[75%] flex items-center justify-center bg-gray-100 rounded"> */}
                    <img src={productImage} alt={product.name} className="w-full" />
                  {/* </div> */}
                  <h4 className="font-bold text-sm mt-2">${product.discountedPrice || product.price}</h4>
                  <p className="w-full text-sm text-[#222] line-clamp-2">
                    {product.name}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="w-full flex items-center justify-center py-10">
              <Loader className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          )}
        </div>
      </div>
      <div className="section6 hidden md:flex flex-col mb-10">
        <h1 className="md:text-[1.7vw] text-[5vw] font-bold mb-5">
          Our Extra services
        </h1>
        <div className="w-full bg-[#F1F6FF] flex flex-row justify-center items-center gap-5">
          <div className="w-1/4 h-[35vh] rounded-lg flex flex-col items-center justify-center relative">
            <div className="w-full h-[65%] bg-[url('./landing/ex1.png')] bg-center bg-cover bg-no-repeat mb-2"></div>
            <div className="absolute bg-black/50 w-full h-[60%] top-0 left-0"></div>
            <div className="rounded-full w-12 h-12 absolute top-[60%] -translate-y-1/2 right-5 bg-[#D1E7FF] border-2 border-white flex items-center justify-center border-solid">
              <Search color="#222" />
            </div>
            <p className="text-[#222] h-[40%] w-full p-3 font-semibold">
              Free Shipping
            </p>
          </div>
          <div className="w-1/4 h-[35vh] rounded-lg flex flex-col items-center justify-center relative">
            <div className="w-full h-[65%] bg-[url('./landing/ex2.png')] bg-center bg-cover bg-no-repeat mb-2"></div>
            <div className="absolute bg-black/50 w-full h-[60%] top-0 left-0"></div>
            <div className="rounded-full w-12 h-12 absolute top-[60%] -translate-y-1/2 right-5 bg-[#D1E7FF] border-2 border-white flex items-center justify-center border-solid">
              <Store color="#222" />
            </div>
            <p className="text-[#222] h-[40%] w-full p-3 font-semibold">
              Easy Returns
            </p>
          </div>
          <div className="w-1/4 h-[35vh] rounded-lg flex flex-col items-center justify-center relative">
            <div className="w-full h-[65%] bg-[url('./landing/ex3.png')] bg-center bg-cover bg-no-repeat mb-2"></div>
            <div className="absolute bg-black/50 w-full h-[60%] top-0 left-0"></div>
            <div className="rounded-full w-12 h-12 absolute top-[60%] -translate-y-1/2 right-5 bg-[#D1E7FF] border-2 border-white flex items-center justify-center border-solid">
              <SendHorizontal color="#222" />
            </div>
            <p className="text-[#222] h-[40%] w-full p-3 font-semibold">
              Secure Payment
            </p>
          </div>
          <div className="w-1/4 h-[35vh] rounded-lg flex flex-col items-center justify-center relative">
            <div className="w-full h-[65%] bg-[url('./landing/ex4.png')] bg-center bg-cover bg-no-repeat mb-2"></div>
            <div className="absolute bg-black/50 w-full h-[60%] top-0 left-0"></div>
            <div className="rounded-full w-12 h-12 absolute top-[60%] -translate-y-1/2 right-5 bg-[#D1E7FF] border-2 border-white flex items-center justify-center border-solid">
              <Shield color="#222" />
            </div>
            <p className="text-[#222] h-[40%] w-full p-3 font-semibold">
              Secure Payment
            </p>
          </div>
        </div>
      </div>
      <div className="section7 mb-10 hidden md:flex flex-col">
        <h1 className="md:text-[1.7vw] text-[5vw] font-bold mb-5">
          Suppliers by region{" "}
        </h1>
        <div className="w-full h-[20vh] flex flex-row flex-wrap justify-center items-center">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="flag w-1/5 h-1/2 bg-white flex flex-row items-center gap-3 px-3 py-2">
              <img className="w-7" src="./flags/AE@2x.png" alt="" />
              <div>
                <h3 className="text-[15px] leading-none text-[#1C1C1C]">
                  Arabic Emirates
                </h3>
                <p className="text-[13px] text-[#8B96A5]">shopbrand.ae</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Landing;
