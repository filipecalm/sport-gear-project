import { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';
import Table from 'react-bootstrap/Table';
import ModalAdmin from '../ModalAdmin';
import styles from './AdminPanel.module.scss';
import { DataProps } from '../../types';

interface CategoryProps {
  category: 'product' | 'category' | 'user' | 'card';
}

const categoryTranslation = {
  product: 'Produto',
  category: 'Categoria',
  user: 'Cliente',
  card: 'Pedido'
};

const productFields = {
  _id: 'Id',
  name: 'Nome',
  price: 'Preço'
};

const categoryFields = {
  _id: 'Id',
  name: 'Nome'
};

const userFields = {
  _id: 'Id',
  name: 'Nome',
  email: 'Email'
};

const orderFields = {
  _id: 'Id do Pedido',
  userId: 'Id do Cliente',
  priceTotal: 'Preço Total'
};

const getHeader = (category: CategoryProps['category']) => {
  switch (category) {
    case 'product':
      return productFields;
    case 'category':
      return categoryFields;
    case 'card':
      return orderFields;
    case 'user':
      return userFields;
    default:
      return {};
  }
};

function AdminTable({
  header,
  data,
  setData,
  category,
  setIsEdit,
  setSelectedId
}: any) {
  const filteredData = data.map((item: DataProps) => {
    const filteredItem: { [key: string]: any } = {};
    Object.keys(header).forEach((key: string) => {
      filteredItem[key] = item[key];
    });
    return filteredItem;
  });

  const deleteItem = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/${category}/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      await response.json();

      const filteredData = data.filter((item: DataProps) => item._id !== id);
      setData(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  const editItem = (id: string) => {
    setIsEdit(true);
    setSelectedId(id);
  };

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  return (
    <div className={styles.table}>
      <Table striped="columns" className={styles.responsiveTable}>
        <thead>
          <tr>
            {Object.keys(header).map((item: string) => (
              <th>{header[item]}</th>
            ))}
            <th className={styles.actions}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item: DataProps) => (
            <tr key={item._id}>
              {Object.keys(item).map((key: string) => (
                <td key={key}>
                  {key === 'price' || key === 'priceTotal'
                    ? formatCurrency(item[key])
                    : item[key]}
                </td>
              ))}
              <td>
                <div className={styles.buttons}>
                  {category !== 'card' && (
                    <div className={styles.button}>
                      <button onClick={() => editItem(item._id)}>Editar</button>
                    </div>
                  )}
                  <div className={styles.button}>
                    <button onClick={() => deleteItem(item._id)}>
                      Excluir
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default function AdminPanel() {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [selectedItemData, setSelectedItemData] = useState<DataProps>();
  const [activeCategory, setActiveCategory] =
    useState<CategoryProps['category']>('product');
  const [data, setData] = useState<DataProps>();
  const userStorageData = localStorage.getItem('userData');
  const userData = userStorageData ? JSON.parse(userStorageData) : null;

  const fetchListData = async () => {
    try {
      const response = await fetch(`${serverUrl}/${activeCategory}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchItemData = async (id: string) => {
    try {
      const response = await fetch(`${serverUrl}/${activeCategory}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setSelectedItemData(data);
      setIsOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const registerItem = () => {
    setIsOpen(true);
    setIsEdit(false);
  };

  const onCloseModal = () => {
    console.log('onCloseModal');
    setIsOpen(false);
    setSelectedId(undefined);
    setSelectedItemData(undefined);
  };

  useEffect(() => {
    if (selectedId) fetchItemData(selectedId);
  }, [selectedId]);

  useEffect(() => {
    fetchListData();
  }, [activeCategory, isOpen]);

  return (
    <main>
      <div className={styles.text}>
        <h1>Painel Administrativo</h1>
        <h3>Bem vindo, {userData?.name}!</h3>
      </div>
      <div className={styles.links}>
        <button
          onClick={() => setActiveCategory('product')}
          className={`${styles.btn} ${
            activeCategory === 'product' && styles.activeButton
          }`}
        >
          Produtos
        </button>
        <button
          onClick={() => setActiveCategory('category')}
          className={`${styles.btn} ${
            activeCategory === 'category' && styles.activeButton
          }`}
        >
          Categorias
        </button>
        <button
          onClick={() => setActiveCategory('user')}
          className={`${styles.btn} ${
            activeCategory === 'user' && styles.activeButton
          }`}
        >
          Clientes
        </button>
        <button
          onClick={() => setActiveCategory('card')}
          className={`${styles.btn} ${
            activeCategory === 'card' && styles.activeButton
          }`}
        >
          Pedidos
        </button>
      </div>
      <div>
        <Button className={styles.btnstyle} onClick={() => registerItem()}>
          Cadastrar {categoryTranslation[activeCategory]}
        </Button>
      </div>
      {data && (
        <AdminTable
          header={getHeader(activeCategory)}
          data={data}
          setData={setData}
          category={activeCategory}
          setIsOpen={setIsOpen}
          setIsEdit={setIsEdit}
          setSelectedId={setSelectedId}
        />
      )}
      <ModalAdmin
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onClose={onCloseModal}
        category={activeCategory}
        categoryTranslation={categoryTranslation[activeCategory]}
        isEdit={isEdit}
        selectedItemData={selectedItemData}
      />
    </main>
  );
}
