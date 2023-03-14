import { Button, Input, FormControl, useToast } from '@chakra-ui/react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { submitAdminModalForm } from '../../utils/form';

export default function OrderAdminForm({ setIsOpen, data, onClose }: any) {
  const OrderSchema = Yup.object({
    userId: Yup.string().required('O ID do usuário é obrigatório.'),
    productsId: Yup.string().required('Id do produto é obrigatório'),
    amount: Yup.number().required('A quantidade de produtos é obrigatória.')
  });
  const toast = useToast();
  const token = localStorage.getItem('token');

  const emptyInitialValues = {
    userId: '',
    productsId: '',
    amount: 1
  };
  const initialValues = data ? data : emptyInitialValues;

  const formik = useFormik({
    initialValues,
    onSubmit: async formData => {
      const isUpdate = data ? true : false;
      const operation = isUpdate ? 'atualizado' : 'cadastrado';
      const parsedFormData = {
        product: [
          {
            productsId: formData.productsId,
            amount: formData.amount
          }
        ],
        userId: formData.userId
      };
      const submitFormParams = {
        category: 'card',
        fields: Object.keys(emptyInitialValues),
        formData: parsedFormData,
        setIsOpen,
        token,
        isUpdate,
        id: data ? data._id : '',
        toast
      };
      const response = await submitAdminModalForm(submitFormParams);
      if (response !== 'Acesso Negado!') {
        formik.setSubmitting(false);
        formik.setStatus({ isSuccess: true });

        toast({
          title: 'Sucesso.',
          description: `Seu pedido foi ${operation}.`,
          status: 'success',
          duration: 9000,
          isClosable: true
        });
        setIsOpen(false);
      } else {
        toast({
          title: 'Erro ao fazer a operação.',
          description: 'Por favor tente novamente.',
          status: 'error',
          duration: 9000,
          isClosable: true
        });
      }
    },
    validationSchema: OrderSchema
  });

  console.log(formik);

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormControl mt={4}>
        <Input
          id="userId"
          name="userId"
          placeholder="User ID"
          value={formik.values.userId}
          onChange={formik.handleChange}
          required
        />
      </FormControl>
      <FormControl mt={4}>
        <Input
          id="productsId"
          name="productsId"
          placeholder="ID do produto"
          value={formik.values.name}
          onChange={formik.handleChange}
          required
        />
      </FormControl>
      <FormControl mt={4}>
        <Input
          id="amount"
          name="amount"
          placeholder="Quantidade"
          type="number"
          value={formik.values.amount}
          onChange={formik.handleChange}
          required
        />
      </FormControl>
      <Button
        colorScheme="blue"
        mr={3}
        type="submit"
        sx={{ margin: '10px' }}
      >
        Salvar
      </Button>
      <Button onClick={() => onClose()} sx={{ margin: '10px' }}>
        Cancelar
      </Button>
    </form>
  );
}
