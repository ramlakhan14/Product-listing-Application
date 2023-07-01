// pages/index.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { CSVLink } from 'react-csv';
import styles from '../styles/Home.module.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastSyncDate, setLastSyncDate] = useState('');

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 300000); // Refresh data every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async (page=currentPage) => {
    try {
      const response = await axios.get(
        `https://ecom-mock.mumzworld.tech/products?page=${page}&limit=10`
      );
      const { data } = response;
      const { pageCount:totalPages, data: products } = data;

      setProducts(products);
      setTotalPages(totalPages);
      setLastSyncDate(new Date().toLocaleString());
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchProducts(page)
  };

  const renderStars = (rating) => {
    const filledStars = Math.floor(rating);
    const emptyStars = 5 - filledStars;

    return (
      <>
        {[...Array(filledStars)].map((_, index) => (
          <AiFillStar key={index} className={styles.star} />
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <AiOutlineStar key={index} className={styles.star} />
        ))}
      </>
    );
  };

  const handleExportToCSV = () => {
    const csvData = products.map(({ name, image, price, rating }) => ({
      Name: name,
      Image: image,
      Price: price,
      Rating: rating,
    }));

    return csvData;
  };

  return (
    <div className={styles.container}>




      <header className={styles.header}>
        <h1>TOYS</h1>
        <p>Last Sync: {lastSyncDate}</p>

        <div className={styles.exportBtn}>
        <button>
          <CSVLink data={handleExportToCSV()} filename={'products.csv'}>
            Export to CSV
          </CSVLink>
          </button>
        </div>
      </header>
      

      <main className={styles.main}>

        <div className={styles.products}>

          {products.map(({ id, name, image, price, rating }) => (

            <div key={id} className={styles.product}>

              <img src={image} alt={name} className={styles.productImage} />
        
              <h3 className={styles.productName}>{name}</h3>

              <div className={styles.productRating}>{renderStars(rating)}</div>

              <p className={styles.productPrice}>Price: {price}</p>

            </div>

            
          ))}
        </div>

        <div className={styles.pagination}>
          {currentPage > 1 && (
            <button onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
          )}
          {currentPage < totalPages && (
            <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
          )}
        </div>

      </main>
    </div>
  );
};

export default Home;