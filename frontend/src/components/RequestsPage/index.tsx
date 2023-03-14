import { useState, useEffect } from 'react';
import styles from './RequestsPage.module.scss';

interface Product {
  description: string;
  name: string;
  price: number;
  images: string;
}

interface OrdersProducts {
  _id: string;
  amount: number;
  date: string;
  productsId: Product;
}

interface Order {
  _id: string;
  priceTotal: number;
  OrdersProductId: [OrdersProducts];
}

export default function RequestsPage() {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const userId = localStorage.getItem('userId');
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${serverUrl}/card/user/${userId}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className={styles.container}>
      {orders.map(order => {
        return (
          <div className={styles.box}>
            <div className={styles.description}>
              <div>
                <h3>PEDIDO Nº {order._id} </h3>
              </div>
              {order.OrdersProductId.map(orderProduct => (
                <div>
                  <div className={styles.image}>
                    <img src={`${serverUrl}/images/product/${orderProduct.productsId.images}`} alt={orderProduct.productsId.name} />
                  </div>
                  <h3>NOME: {orderProduct.productsId.name}</h3>
                  <h3>QTD: {orderProduct.amount}</h3>
                  <h3>DATA: {new Date(orderProduct.date).toLocaleString('en-GB')}</h3>
                  <h3>R$ {orderProduct.productsId.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                </div>
              ))}
              <div>
                <h3>TOTAL R$ {order.priceTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </h3>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}