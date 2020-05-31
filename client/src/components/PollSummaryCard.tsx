import React from 'react';
import { PollDto } from '../types';
import { Link } from 'react-router-dom';
import { Button, Typography, Grid, Chip } from '@material-ui/core';

type PollSummaryCardProps = {
  poll: PollDto;
};

export class PollSummaryCard extends React.Component<PollSummaryCardProps> {
  render() {
    const poll = this.props.poll;

    return (
      <Link to={`/poll?poll_id=${poll.id}`} style={{ textDecoration: 'none' }}>
        <Button variant="outlined" style={{ marginTop: 24, padding: 24, width: '100%', textTransform: 'inherit', textAlign: 'left' }}>
          <Grid container spacing={3} justify="space-between">
            <Grid item>
              <Typography component="h5" variant="h5">
                {poll.name}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {poll.description}
              </Typography>
            </Grid>
            <Grid item>
              <Chip color="primary" label={poll.voters.length + ' votes'} />
            </Grid>
          </Grid>
        </Button>
      </Link>
    );
  }
}