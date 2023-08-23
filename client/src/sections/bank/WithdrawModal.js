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

const WithdrawModal = ({ handleClose }) => {
  const { accountToEdit, withdraw } = useBank();

  return (
    <MainCard
      modal
      title={<Typography variant="h6">Withdraw</Typography>}
      sx={{ width: { xs: "90%", md: "480px" } }}
    >
      <Formik
        initialValues={{
          amount: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          amount: Yup.number()
            .min(0, "Must be greater than or equal to 0")
            .required("Amount is required"),
        })}
        onSubmit={async (values) => {
          const res = await withdraw({
            account_id: accountToEdit?.account_id,
            amount: values.amount,
          });
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
                  <InputLabel htmlFor="withdraw">Amount</InputLabel>
                  <OutlinedInput
                    id="withdraw"
                    size="small"
                    type="number"
                    value={values.amount}
                    name="amount"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    fullWidth
                    error={Boolean(touched.amount && errors.amount)}
                  />
                  {touched.amount && errors.amount && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-withdraw"
                    >
                      {errors.amount}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
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
                    Confirm
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
WithdrawModal.propTypes = {
  handleClose: PropTypes.func,
};
export default WithdrawModal;
