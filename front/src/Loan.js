import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {render_receipt} from './common.js'


const styles = {
  root: {
    minWidth: 275,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  receipt: {
    padding: 30,
    marginTop: 20
  },
  receiptLine: {
    display: 'flex',
  },
  receiptKey: {
    flex: 'auto',
  },
  grid: {
  marginBottom: 50
  }
};

class Loan extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: '',
            loanCurrency: '',
            loanId: '',
            paidCurrency: '',
            receipt: '',
            ended_receipt:''
        }
    }

    handleFormChange = (type, event) => {
       this.setState({[type]: event.target.value});
    }

    handleAddLoanSubmit = async (event) => {
        event.preventDefault()
        const {amount, loanCurrency} = this.state
        const now = new Date()
        const formatted = this.get_formatted_date(now)
        const url = "http://localhost:5000/loan" + `?amount=${amount}&loan_currency=${loanCurrency}&created=${formatted}`
        let resp = await fetch(url, {method: 'POST'})
        let data = await resp.json()
        delete data['ended_details']
        this.setState({receipt: data})
    }

       handleEndLoanSubmit = async (event) => {
        event.preventDefault()
        const {paidCurrency, loanId} = this.state
        const now = new Date()
        const formatted = this.get_formatted_date(now)
        const url = "http://localhost:5000/loan" + `?id=${loanId}&ended=${formatted}&paid_currency=${paidCurrency}`
        let resp = await fetch(url, {method: 'PUT'})
        let data = await resp.json()
        this.setState({ended_receipt: data['ended_details']})
    }

    pad = (date) => {
        return date <10 ? '0' + date : date
    }

    get_formatted_date = (date) => {
        return this.pad(date.getDate()) + '-' + this.pad((date.getMonth()) + 1) + '-' + date.getFullYear()
    }

  render() {
    const {classes} = this.props
    const {amount, loanCurrency, paidCurrency, loanId, receipt, ended_receipt} = this.state

    return (
         <Card className={classes.root}>
                <CardContent>
                    <Typography variant="h5" component="h2" className={classes.cardTitle}>
                        Loan Service
                    </Typography>
                    <Typography variant="h6" component="h2" className={classes.cardTitle}>
                        Make New Loan
                    </Typography>
                    <Grid container justify="center" alignItems="center" spacing={2} className={classes.grid} >
                        <Grid item xs={2}>
                            <TextField
                                id="standard-basic"
                                label="Amount"
                                value={amount}
                                onChange={(event) => this.handleFormChange('amount', event)}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                id="standard-basic"
                                label="Currency"
                                value={loanCurrency}
                                onChange={(event) => this.handleFormChange('loanCurrency', event)}/>
                        </Grid>
                        <Grid item xs={2}>
                            <Button
                                variant="contained"
                                size="medium"
                                color="primary"
                                onClick={(e) => this.handleAddLoanSubmit(e)}>
                            Submit
                            </Button>
                        </Grid>
                    </Grid>
                    {receipt? <div className={classes.receipt}>{render_receipt(receipt, classes)}</div> : null}                    <Typography variant="h6" component="h2" className={classes.cardTitle}>
                        End Existing Loan
                    </Typography>
                    <Grid container justify="center" alignItems="center" spacing={2} >
                        <Grid item xs={2}>
                            <TextField
                                id="standard-basic"
                                label="Loan Id"
                                value={loanId}
                                onChange={(event) => this.handleFormChange('loanId', event)}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                id="standard-basic"
                                label="Currency"
                                value={paidCurrency}
                                onChange={(event) => this.handleFormChange('paidCurrency', event)}/>
                        </Grid>
                        <Grid item xs={2}>
                            <Button
                                variant="contained"
                                size="medium"
                                color="primary"
                                onClick={(e) => this.handleEndLoanSubmit(e)}>
                            Submit
                            </Button>
                        </Grid>
                    </Grid>
                    {ended_receipt? <div className={classes.receipt}>{render_receipt(ended_receipt, classes)}</div> : null}
                </CardContent>
        </Card>
    )
  }
}

export default withStyles(styles)(Loan);
