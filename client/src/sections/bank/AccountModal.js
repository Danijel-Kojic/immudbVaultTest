import PropTypes from "prop-types";
// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

import MainCard from "components/MainCard";

// project import
import useBank from "hooks/useBank";

// ============================|| FIREBASE - LOGIN ||============================ //

const AccountModal = ({ handleClose }) => {
  const { accountToEdit, createAccount, updateAccount } = useBank();

  return (
    <MainCard
      modal
      title={
        <Typography variant="h6">
          {accountToEdit ? "Edit Account" : "Add Account"}
        </Typography>
      }
      sx={{ width: { xs: "90%", md: "480px" } }}
    >
      <Formik
        initialValues={{
          name: accountToEdit?.name ?? "",
          email: accountToEdit?.email ?? "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required("Name is required"),
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
        })}
        onSubmit={async (values) => {
          const res = accountToEdit
            ? await updateAccount(accountToEdit?.account_id, values)
            : await createAccount(values);
          if (res) handleClose();
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="name-name">Username</InputLabel>
                  <OutlinedInput
                    id="name-name"
                    size="small"
                    type="text"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                  />
                  {touched.name && errors.name && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-name-name"
                    >
                      {errors.name}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              {!accountToEdit && (
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="name-email">Email</InputLabel>
                    <OutlinedInput
                      id="name-email"
                      size="small"
                      type="text"
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      fullWidth
                      error={Boolean(touched.email && errors.email)}
                    />
                    {touched.email && errors.email && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-email-email"
                      >
                        {errors.email}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
              )}
              <Grid item xs={12}>
                <Stack direction="row" spacing={3} justifyContent="flex-end">
                  <Button variant="outlined" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    {accountToEdit ? "Update" : "Save"}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </MainCard>
  );
};
AccountModal.propTypes = {
  handleClose: PropTypes.func,
};
export default AccountModal;
