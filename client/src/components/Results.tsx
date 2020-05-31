import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PollDto } from '../types';
import axios from 'axios';
import { PollSummaryCard } from './PollSummaryCard';
import { Button, Typography, Grid, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import { getParam } from '../helpers';
import { getPoll } from '../api/poll';

type PollResults = {
  winner: string;
  resultsTable: any[];
};

type ResultsState = {
  poll_id: string | null;
  poll: PollDto | null;
  results: PollResults | null;
};

export class Results extends Component<{}, ResultsState>  {
  constructor(props: {}) {
    super(props);

    this.state = {
      poll_id: getParam('poll_id'),
      poll: null,
      results: null
    };
  }

  private getWinner = () => {
    axios.get<PollResults>('/api/poll/getWinner', {
      params: {
        id: this.state.poll_id
      }
    }).then(res => {
      this.setState({
        results: res.data
      });
    }).catch(err => {
      console.log('error while getting winner', err);
    })
  }

  componentDidMount() {
    if (this.state.poll_id) {
      this.getWinner();

      getPoll(this.state.poll_id)
        .then(res => {
          this.setState({
            poll: res.data
          });
        }).catch(err => {
          console.log(err);
        })
    }
  }

  render() {
    if (!this.state.poll) {
      return <div />
    }

    const options = this.state.poll.options;

    return (
      <div style={{ width: '50%', marginLeft: '25%' }}>
        {this.state.poll && <Link to={`/poll?poll_id=${this.state.poll.id}`}>Back to Poll</Link>}
        {this.state.results && options &&
          <div>
            <Typography variant='h3'>Winner of {this.state.poll.name}:</Typography>
            <Typography variant='h4'>{this.state.results.winner}</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Round</TableCell>
                  {options.map(o => <TableCell key={o}>{o}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.results.resultsTable.map((x, index) =>
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    {options.map(o => <TableCell key={o}>{x[o]}</TableCell>)}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        }
      </div>
    );
  }
}