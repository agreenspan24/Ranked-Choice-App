import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PollDto } from '../types';
import { getPoll } from '../api/poll';
import { getParam } from '../helpers';
import { TextField, Breadcrumbs, Grid, Button, ButtonGroup } from '@material-ui/core';

export class Poll extends Component<{}, PollDto> {
  constructor(props: any) {
    super(props);

    const id = getParam('poll_id');

    this.state = {
      id: id,
      name: '',
      description: '',
      options: [''],
      voters: []
    };
  }

  componentDidMount() {
    if (this.state.id) {
      this.getPoll();
    }
  }

  private getPoll = () => {
    if (!this.state.id) return;

    getPoll(this.state.id).then(res => {
      const poll = res.data;

      this.setState({
        name: poll.name,
        description: poll.description,
        options: poll.options,
        voters: poll.voters
      });
    }).catch(err => {
      console.log(err);
    });
  }

  private deletePoll = () => {
    axios.delete('/api/poll', {
      params: {
        id: this.state.id
      }
    });
  }

  private upsertPoll = () => {
    const poll = {
      ...this.state,
      options: this.state.options.filter(o => !!o)
    };

    axios.post('/api/poll', poll)
      .then(res => {
        console.log(res.data);

        this.setState({
          id: res.data
        });
      }).catch(err => {
        console.log(err);
      });
  }

  private addOption = () => {
    const options = this.state.options.slice(0);
    options.push('');

    this.setState({
      options: options
    })
  }

  private updateOption = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const options = this.state.options.slice(0);
    options[index] = e.target.value;

    this.setState({
      options: options
    });
  }

  render() {
    return (
      <div>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to='/'>Home</Link>
        </Breadcrumbs>
        <Grid container justify='space-between'>
          <Grid item>
            <h2>{this.state.id ? 'Edit' : 'Create'} Poll</h2>
          </Grid>
          {this.state.id && <Grid>
            <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
              <Button>
                <Link to='/' onClick={this.deletePoll} style={{textDecoration: 'inherit', color: 'inherit'}}>
                  Delete
                </Link>
              </Button>
              <Button>
                <Link to={`/results?poll_id=${this.state.id}`} style={{textDecoration: 'inherit', color: 'inherit'}}>
                  See Results
                </Link>
              </Button>
              <Button>
                <Link to={`/vote?poll_id=${this.state.id}`} style={{textDecoration: 'inherit', color: 'inherit'}}>
                  Vote
                </Link>
              </Button>
            </ButtonGroup>
          </Grid>}
        </Grid>
        <div>
          <TextField
            name='name'
            value={this.state.name}
            onChange={e => this.setState({ 'name': e.target.value })}
            label='Name'
            style={{ width: '100%', marginTop: 24 }}
          />
        </div>
        <div>
          <TextField
            multiline
            name='description'
            value={this.state.description}
            onChange={e => this.setState({ 'description': e.target.value })}
            label='Description'
            style={{ width: '100%', marginTop: 24 }}
          />
        </div>
        <div>
          <Grid container spacing={2}>
            {this.state.options.map((x, i) =>
              <Grid key={i} item xs={12} md={4}>
                <TextField
                  name={'option-' + i}
                  value={x}
                  onChange={e => this.updateOption(e, i)}
                  style={{ width: '100%', marginTop: 24 }}
                  placeholder={'Option #' + (i + 1)}
                />
              </Grid>
            )}
            <Grid item xs={12} md={4}>
              <Button
                disabled={!!this.state.options.length && !this.state.options[this.state.options.length - 1]}
                onClick={this.addOption}
                style={{ width: '100%', marginTop: 24 }}
              >
                Add Option
              </Button>
            </Grid>
          </Grid>
        </div>
        <div>
          <Button
            onClick={this.upsertPoll}
            variant="contained"
            color="primary"
            style={{ width: '100%', marginTop: 24 }}
          >
            {this.state.id ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    );
  }
}