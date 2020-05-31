import React, { Component } from 'react';
import { PollDto } from '../types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getPoll } from '../api/poll';
import { getParam } from '../helpers';
import { Table, TableHead, TableBody, TableRow, TableCell, TextField, FormControl, Button, Select, MenuItem } from '@material-ui/core';

type OptionRank = {
  rank: number;
  option: string | null;
}

type VoteState = {
  poll_id: string | null;
  poll: PollDto | null;
  voter: string;
  remainingOptions: string[];
  choices: OptionRank[];
}

export class Vote extends Component<{}, VoteState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      poll_id: getParam('poll_id'),
      poll: null,
      voter: '',
      remainingOptions: [],
      choices: []
    };
  }

  private getPoll = () => {
    if (!this.state.poll_id) return;

    getPoll(this.state.poll_id).then(res => {
      const choices: OptionRank[] = [];

      for (let i = 0; i < res.data.options.length; i++) {
        choices.push({
          rank: i,
          option: null
        });
      }

      this.setState({
        poll: res.data,
        remainingOptions: res.data.options.slice(0),
        choices: choices
      });
    }).catch(err => {
      console.log(err);
    });
  }

  private isValid = () => {
    if (!this.state.voter) {
      return false;
    }

    const seenBefore: string[] = [];

    return this.state.choices.every(or => {
      if (or.option) {
        if (seenBefore.indexOf(or.option) > -1) {
          return false;
        }

        seenBefore.push(or.option);
      } else if (or.rank === 1) {
        return false;
      }

      return true;
    });
  }

  private sendVote = () => {
    axios.put('/api/vote', {
      id: this.state.poll_id,
      voter: this.state.voter,
      choices: this.state.choices
    }).then(res => {
      console.log('success');
    }).catch(err => {
      console.log('error');
    });
  }

  private changeRank = (rank: number, value: unknown): void => {
    const choices = this.state.choices.slice(0);
    let remainingOptions = this.state.remainingOptions.slice(0);

    const optionRank = choices.find(x => x.rank === rank);
    if (optionRank) {
      if (optionRank.option) {
        remainingOptions.push(optionRank.option);
      }

      optionRank.option = value as string

      remainingOptions = remainingOptions.filter(x => x !== value as string);
    }

    this.setState({
      choices: choices,
      remainingOptions: remainingOptions
    });
  }

  private getOptions = (selectedOption: string | null): string[] => {
    if (selectedOption) {
      return [selectedOption].concat(this.state.remainingOptions);
    }

    return this.state.remainingOptions;
  }

  componentDidMount() {
    if (this.state.poll_id) {
      this.getPoll();
    }
  }

  render() {
    if (!this.state.poll) {
      return <div />;
    }

    return (
      <>
        {this.state.poll && <Link to={`/poll?poll_id=${this.state.poll.id}`}>Back to Poll</Link>}
        <h1>Vote in {this.state.poll.name}</h1>
        <div>
          <TextField
            name='voter'
            value={this.state.voter}
            onChange={e => this.setState({ 'voter': e.target.value })}
            label='Voter Name'
          />
        </div>
        {this.state.poll && <Table style={{marginTop: 24}}>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Option</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.choices.map(or =>
              <TableRow key={or.rank}>
                <TableCell>
                  {or.rank + 1}
                </TableCell>
                <TableCell>
                  <FormControl style={{minWidth: 240}}>
                    <Select
                      value={or.option || ''}
                      onChange={e => this.changeRank(or.rank, e.target.value)}
                    >
                      <MenuItem value=''>&nbsp;</MenuItem>
                      {this.getOptions(or.option).map(o =>
                        <MenuItem key={o} value={o}>{o || '\xa0'}</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>}
        <Button 
          disabled={!this.isValid()} 
          onClick={this.sendVote}
          variant="contained"
          color="primary"
          style={{ width: '100%', marginTop: 24 }}
        >
          <Link to={`/poll?poll_id=${this.state.poll.id}`} style={{textDecoration: 'inherit', color: 'inherit'}}>Vote</Link>
        </Button>
      </>
    );
  }
}