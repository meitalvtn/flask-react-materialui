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
  }
};

class Exchange extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: '',
            from: '',
            to: '',
            receipt: null
        }
    }

    handleFormChange = (type, event) => {
       this.setState({[type]: event.target.value});
    }

    handleSubmit = async (event) => {
        event.preventDefault()
        const {amount, to, from} = this.state
        const url = "http://localhost:5000/exchange" + `?amount=${amount}&to=${to}&base=${from}`
        let resp = await fetch(url)
        let data = await resp.json()
        this.setState({receipt: data})
    }

  render() {
    const {classes, amount, to, from} = this.props
    const {receipt} = this.state

      return (
        <Card className={classes.root}>
          <CardContent>
            <Typography variant="h5" component="h2" className={classes.cardTitle}>
              Exchange Service
            </Typography>
                <Grid container justify="center" alignItems="center" spacing={2} >
                    <Grid item xs={2}>
                        <TextField
                            id="standard-basic"
                            label="Amount"
                            value={amount}
                            onChange={(event) => this.handleFormChange('amount', event)} />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id="standard-basic"
                            label="From"
                            value={from}
                            onChange={(event) => this.handleFormChange('from', event)} />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id="standard-basic"
                            label="To" value={to}
                            onChange={(event) => this.handleFormChange('to', event)} />
                    </Grid>
                </Grid>
          {receipt? <div className={classes.receipt}>{render_receipt(receipt, classes)}</div> : null}
          </CardContent>
          <CardActions style={{justifyContent: 'center'}}>
            <Button
                variant="contained"
                size="medium"
                color="primary"
                onClick={e => this.handleSubmit(e)}>Submit</Button>
          </CardActions>
        </Card>
      );
  }
}

export default withStyles(styles)(Exchange);

