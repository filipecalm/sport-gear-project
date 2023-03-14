import { Button, Input, FormControl, useToast } from '@chakra-ui/react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { submitAdminModalForm } from '../../utils/form';

export default function CategoryAdminForm({ setIsOpen, data, onClose }: any) {
  const categorySchema = Yup.object({
    name: Yup.string().required('Nome é obrigatório')
  });
  const toast = useToast();
  const token = localStorage.getItem('token');

  const emptyInitialValues = {
    name: ''
  };
  const initialValues = data ? data : emptyInitialValues;

  const formik = useFormik({
    initialValues,
    onSubmit: async formData => {
      const isUpdate = data ? true : false;
      const operation = isUpdate ? 'atualizada' : 'cadastrada';
      const submitFormParams = {
        category: 'category',
        fields: Object.keys(emptyInitialValues),
        formData,
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
          description: `Sua categoria foi ${operation}.`,
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
    validationSchema: categorySchema
  });

  console.log(formik);

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormControl mt={4}>
        <Input
          id="name"
          name="name"
          placeholder="Nome"
          value={formik.values.name}
          onChange={formik.handleChange}
          required
        />
      </FormControl>
      <Button colorScheme="blue" sx={{ margin: '20px 0' }} mr={3} type="submit">
        Salvar
      </Button>
      <Button onClick={() => onClose()}>Cancelar</Button>
    </form>
  );
}
