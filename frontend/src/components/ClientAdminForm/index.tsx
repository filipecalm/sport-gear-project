import { Input, FormControl, useToast, Select, Button } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { submitAdminModalForm } from '../../utils/form';
import styles from './ClientAdminForm.module.scss';

export default function ClientAdminForm({ setIsOpen, data, onClose }: any) {
  const isUpdate = data ? true : false;

  const clientSchema = Yup.object({
    name: isUpdate ? Yup.string() : Yup.string().required('Nome é obrigatório'),
    email: isUpdate
      ? Yup.string()
      : Yup.string().required('Email é obrigatório'),
    cpf: isUpdate ? Yup.string() : Yup.string().required('CPF é obrigatório'),
    rg: Yup.string(),
    birth: Yup.string(),
    phone: isUpdate
      ? Yup.string()
      : Yup.string().required('Telefone é obrigatório'),
    password: isUpdate
      ? Yup.string()
      : Yup.string().required('Senha é obrigatório'),
    confirmpassword: isUpdate
      ? Yup.string()
      : Yup.string().test(
          'passwords-match',
          'Os valores da senhas devem ser iguais',
          function (value) {
            return this.parent.password === value;
          }
        ),
    gender: isUpdate
      ? Yup.string()
      : Yup.string().required('Gênero é obrigatório')
  });

  if (isUpdate)
    clientSchema.shape({
      newpassword: Yup.string().test(
        'passwords-match',
        'Os valores da senhas devem ser iguais',
        function (value) {
          return this.parent.confirmpassword === value;
        }
      )
    });

  const toast = useToast();
  const token = localStorage.getItem('token');

  const emptyInitialValues = {
    name: '',
    email: '',
    password: '',
    confirmpassword: '',
    cpf: '',
    rg: '',
    birth: '',
    phone: '',
    gender: ''
  };
  const initialValues = isUpdate
    ? { ...data, newpassword: '' }
    : emptyInitialValues;

  const formik = useFormik({
    initialValues,
    onSubmit: async formData => {
      const operation = isUpdate ? 'atualizado' : 'cadastrado';
      const parsedData = {
        ...formData,
        cpf: formData.cpf.toString(),
        rg: formData.rg ? formData.rg.toString() : undefined,
        birth: formData.birth
          ? new Date(formData.birth).toLocaleDateString('en-US', {
              timeZone: 'America/Sao_Paulo',
              month: '2-digit',
              day: '2-digit',
              year: 'numeric'
            })
          : undefined,
        phone: formData.phone.toString()
      };
      const submitFormParams = {
        category: 'user',
        fields: Object.keys(emptyInitialValues),
        formData: parsedData,
        setIsOpen,
        token,
        isUpdate,
        id: data ? data._id : '',
        toast
      };
      console.log(submitFormParams);
      const response = await submitAdminModalForm(submitFormParams);
      console.log(response);
      if (response !== 'Acesso Negado!') {
        formik.setSubmitting(false);
        formik.setStatus({ isSuccess: true });

        toast({
          title: 'Sucesso.',
          description: `Cliente ${operation}.`,
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
    validationSchema: clientSchema
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormControl mt={4}>
        <Input 
          id="name"
          name="name"
          placeholder="Nome"
          value={formik.values.name}
          onChange={formik.handleChange}
          required={!isUpdate}
        />
      </FormControl>
      <FormControl mt={4}>
        <Input
          id="email"
          name="email"
          placeholder="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          required={!isUpdate}
        />
      </FormControl>
      <FormControl mt={4}>
        <Input
          id="cpf"
          name="cpf"
          type="number"
          maxLength={11}
          onChange={e => {
            if (e.target.value.length !== 11) {
              formik.setFieldError('cpf', 'CPF deve ter 11 caracteres');
            } else {
              formik.setFieldError('cpf', undefined);
            }
            formik.handleChange(e);
          }}
          value={formik.values.cpf}
          isInvalid={!!(formik.errors.cpf && formik.touched.cpf)}
          errorBorderColor="red.300"
          placeholder="CPF"
          required={!isUpdate}
        />
      </FormControl>
      <FormControl mt={4}>
        <Input
          id="rg"
          name="rg"
          type="number"
          placeholder="RG"
          onChange={formik.handleChange}
          value={formik.values.rg}
        />
      </FormControl>
      <FormControl mt={4}>
        <Select
          id="gender"
          name="gender"
          placeholder="Sexo"
          variant="filled"
          onChange={formik.handleChange}
          value={formik.values.gender}
        >
          {['Masculino', 'Feminino'].map(option => (
            <option key={option} value={option.toLowerCase()}>
              {option}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl mt={4}>
        <DatePicker
          id="birth"
          name="birth"
          selected={formik.values.birth ? new Date(formik.values.birth) : null}
          onChange={(date: Date) => formik.setFieldValue('birth', date)}
          dateFormat="dd/MM/yyyy"
          showYearDropdown
          yearDropdownItemNumber={100}
          scrollableYearDropdown
          showMonthDropdown
          className={styles.datepicker}
          placeholderText="Data de Nascimento"
        />
      </FormControl>
      <FormControl mt={4}>
        <Input
          id="phone"
          name="phone"
          type="number"
          variant="filled"
          onChange={formik.handleChange}
          value={formik.values.phone}
          placeholder="Telefone"
        />
      </FormControl>
      <FormControl mt={4}>
        <Input
          id="password"
          name="password"
          type="password"
          variant="filled"
          onChange={formik.handleChange}
          value={formik.values.password}
          placeholder="Senha"
          isInvalid={!!formik.errors.password}
        />
      </FormControl>
      <FormControl mt={4}>
        <Input
          id="confirmpassword"
          name="confirmpassword"
          type="password"
          variant="filled"
          onChange={formik.handleChange}
          value={formik.values.confirmpassword}
          placeholder="Confirmar Senha"
          isInvalid={!!formik.errors.confirmpassword}
        />
      </FormControl>
      {isUpdate && (
        <FormControl mt={4}>
          <Input
            id="newpassword"
            name="newpassword"
            type="password"
            variant="filled"
            onChange={formik.handleChange}
            value={formik.values.newpassword}
            placeholder="Nova Senha"
            isInvalid={!!formik.errors.newpassword}
          />
        </FormControl>
      )}

      <Button colorScheme="blue" sx={{ margin: '20px 0' }} mr={3} type="submit">
        Salvar
      </Button>
      <Button onClick={() => onClose()}>Cancelar</Button>
    </form>
  );
}
