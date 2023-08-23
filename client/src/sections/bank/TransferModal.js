import PropTypes from "prop-types";
// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
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

const TransferModal = ({ handleClose }) => {
  const { accountToEdit, transfer, accountList } = useBank();

  return (
    <MainCard
      modal
      title={<Typography variant="h6">Transfer</Typography>}
      sx={{ width: { xs: "90%", md: "480px" } }}
    >
      <Formik
        initialValues={{
          account_id_to: "",
          amount: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          account_id_to: Yup.string().required("Receiver is required"),
          amount: Yup.number()
            .min(0, "Must be greater than or equal to 0")
            .required("Amount is required"),
        })}
        onSubmit={async (values) => {
          const res = await transfer({
            account_id_from: accountToEdit?.account_id,
            account_id_to: values.account_id_to,
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
                  <InputLabel htmlFor="receiver">Receiver</InputLabel>
                  <Select
                    id="receiver"
                    size="small"
                    type="number"
                    value={values.account_id_to}
                    name="account_id_to"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    fullWidth
                    error={Boolean(
                      touched.account_id_to && errors.account_id_to
                    )}
                  >
                    {accountList
                      ?.filter(
                        (account) =>
                          account?.account_id !== accountToEdit?.account_id
                      )
                      ?.map((account) => {
                        return (
                          <MenuItem
                            key={`receiver_${account?.account_id}`}
                            value={account?.account_id}
                          >
                            {account?.name} ({account?.email})
                          </MenuItem>
                        );
                      })}
                  </Select>
                  {touched.account_id_to && errors.account_id_to && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-receiver"
                    >
                      {errors.account_id_to}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="transfer">Amount</InputLabel>
                  <OutlinedInput
                    id="transfer"
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
                      id="standard-weight-helper-text-transfer"
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
TransferModal.propTypes = {
  handleClose: PropTypes.func,
};
export default TransferModal;
