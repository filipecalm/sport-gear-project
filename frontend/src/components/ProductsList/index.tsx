import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Link from '../Link';
import styles from './ProductsList.module.scss';

interface Product {
  _id: string;
  images?: string;
  name: string;
  price: number;
  description?: string;
  categoryid?: string;
}

interface Category {
  _id: string;
  name: string;
}

export default function ProductsList() {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const productsPerPage = 12;
  const pagesCount = Math.ceil(products.length / productsPerPage);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const currentProducts = products
    ? products.slice(
        currentPage * productsPerPage,
        (currentPage + 1) * productsPerPage
      )
    : [];

  const fetchProducts = async () => {
    fetch(`${serverUrl}/product`)
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error(error));
  };

  const fetchProductsByCategory = async () => {
    fetch(`${serverUrl}/product/category/${id}`)
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error(error));
  };

  const fetchCategories = async () => {
    fetch(`${serverUrl}/category`)
      .then(response => response.json())
      .then(data => {
        console.log({ data });
        setCategories(data);
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    if (id) fetchProductsByCategory();
    else fetchProducts();
    fetchCategories();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.form}>
          <h5>LINHAS</h5>
          <div className={styles.formCheckItem}>
            <ul>
              {Array.isArray(categories) &&
                categories.map(category => (
                  <li key={category._id} className={styles.flex}>
                    <Link
                      texto={category.name}
                      redirect={`/products/category/${category._id}`}
                      className={
                        category._id === id ? styles.activeCategory : undefined
                      }
                    />
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className={styles.grid}>
          {products.length > 0 &&
            currentProducts.map(product => {
              return (
                <Link redirect={`/product/${product._id}`} key={product._id}>
                  <div className={styles.image}>
                    <img
                      title="product"
                      alt="Imagem do produto"
                      className={styles.image}
                      src={`${serverUrl}/images/product/${product.images}`}
                    />
                    <h3 className={styles.h3}> {product.name} </h3>
                    <p className={styles.p}>
                      R${' '}
                      {product.price.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                  </div>
                </Link>
              );
            })}
        </div>
        <div className={styles.pagination}>
          <button
            title="icon"
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
          >
            <FaChevronLeft />
          </button>
          <span className={styles.span}>
            {currentPage + 1} de {pagesCount}
          </span>
          <button
            title="icon"
            onClick={handleNextPage}
            disabled={currentPage === pagesCount - 1}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
