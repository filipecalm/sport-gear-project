import { useState, useEffect } from 'react';
import Link from '../Link';
import Card from 'react-bootstrap/Card';
import styles from './HomeProducts.module.scss';

interface Product {
  _id: string;
  images?: string;
  name: string;
  price: number;
  description?: string;
  categoryid?: string;
}

export default function HomeProducts() {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    fetch(`${serverUrl}/product`)
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section className={styles.sectionCards}>
      <div className={styles.h1}>
        <h1>Nossos Produtos</h1>
      </div>
      <div className={styles.boxWrapper}>
        {products.slice(0, 3).map(product => {
          return (
            <div className={styles.container}>
              <Card className={styles.card}>
                <Card.Img
                  className={styles.cardImage}
                  src={`${serverUrl}/images/product/${product.images}`}
                />
                <Card.Body className={styles.cardBody}>
                  <Card.Title className={styles.cardTitle}>
                    {product.name}
                  </Card.Title>
                  <Link
                    texto="Saiba mais"
                    redirect="products"
                    className={styles.btn}
                  />
                </Card.Body>
              </Card>
            </div>
          );
        })}
      </div>
    </section>
  );
}
