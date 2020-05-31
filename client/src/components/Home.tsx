import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PollDto } from '../types';
import axios from 'axios';
import { PollSummaryCard } from './PollSummaryCard';
import { Button, Typography, Grid } from '@material-ui/core';

type HomeState = {
  polls: PollDto[];
}

export class Home extends Component<{}, HomeState>  {
  constructor(props: {}) {
    super(props);

    this.state = {
      polls: []
    };
  }

  componentDidMount() {
    axios.get<PollDto[]>('/api/polls')
      .then(res => {
        this.setState({
          polls: res.data
        });
      }).catch(err => {
        console.log(err);
      })
  }

  render() {
    return (
      <div>
        <Grid container spacing={3} justify="space-between" style={{ marginTop: 24 }}>
          <Grid item>
            <Typography component="h2" variant="h2">
              Ranked Choice Voting
                        </Typography>
          </Grid>
          <Grid item>
            <Link to="/poll">
              <Button variant="contained" color="primary">
                Create Poll
                            </Button>
            </Link>
          </Grid>
        </Grid>
        {this.state.polls.map(p => <PollSummaryCard key={p.id} poll={p} />)}
      </div>
    );
  }
}