import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Loan from './Loan'
import Exchange from './Exchange'
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    textAlign: 'center',
  },
  cards: {
    padding: 10
  }
}));


export default function App() {

const classes = useStyles();

  return (
  <div className={classes.page}>
    <AppBar position="static">
    <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Allenby Exchange & Co
        </Typography>
        <Button color="inherit">Login</Button>
     </Toolbar>
    </AppBar>
        <Grid container spacing={3} className={classes.cards}>
            <Grid item xs={6}>
                <Exchange/>
            </Grid>
            <Grid item xs={6}>
                <Loan/>
            </Grid>
        </Grid>
  </div>
  );
}
