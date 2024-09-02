import React, { Component, ChangeEvent, MouseEvent } from "react";
import { isRecord } from "./record";

type AddGuestProps = {
  onBackClick : () => void
};


type AddGuestState = {
  name: string,
  host : string,
  isFamily: boolean,
  error: string
};


/** Displays the list of created design files. */
export class AddGuest extends Component<AddGuestProps, AddGuestState> {

  constructor(props: AddGuestProps) {
    super(props);

    this.state = {name: '', host: '', isFamily: false, error: ''};
  }

  render = (): JSX.Element => {
    return (<div>
        <h3>Add Guest</h3>
        <div>
          <label style={{marginRight: '5px' }}> Name:</label>
          <input type="text" onChange={this.doNameChange}></input><br></br>
        </div>
        <div>
          Guest of:<br></br>
          <input type="radio" id="Molly" name="host" value="Molly" onChange={this.doHostChange} style={{marginLeft: '15px' }}></input>Molly
          <br></br>
          <input type="radio" id="James" name="host" value="James" onChange={this.doHostChange} style={{marginLeft: '15px' }}></input>James<br></br>
          <br></br>
        </div>
        <div>
          <input type="checkbox" id="isFamily" name="isFamily" value="isFamily" onChange={this.doIsFamilyChange}></input>Family?<br></br>
          <br></br>
        </div>
        <button type="button" onClick={this.doAddClick} style={{marginRight: '5px' }}>Add</button>
        <button type="button" onClick={this.doBackClick} style={{marginRight: '5px' }}>Back</button>
        {this.renderError()}
      </div>);
  };

  renderError = (): JSX.Element => {
    if (this.state.error.length === 0) {
      return <div></div>;
    } else {
      const style = {width: '300px', backgroundColor: 'rgb(246,194,192)',
          border: '1px solid rgb(137,66,61)', borderRadius: '5px', padding: '5px' };
      return (<div style={{marginTop: '15px'}}>
          <span style={style}><b>Error</b>: {this.state.error}</span>
        </div>);
    }
  };
  
  doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({name: evt.target.value, error: ''});
  };

  doHostChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({host: evt.target.value, error: ''});
  };

  doIsFamilyChange = (_evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({isFamily: !this.state.isFamily, error: ''});
  };

  doAddClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    if (this.state.name.trim().length === 0 ||
        this.state.host.trim().length === 0) {
      this.setState({error: "a required field is missing."});
      return;
    }

    const guestInfo = { name: this.state.name,
        host: this.state.host, isFamily: this.state.isFamily};
    fetch("/api/add", {
        method: "POST", body: JSON.stringify(guestInfo),
        headers: {"Content-Type": "application/json"} })
      .then(this.doAddResp)
      .catch(() => this.doAddError("failed to connect to server"));
  };

  doAddResp = (resp: Response): void => {
    if (resp.status === 200) {
      resp.json().then(this.doAddJson)
          .catch(() => this.doAddError("200 response is not JSON"));
    } else if (resp.status === 400) {
      resp.text().then(this.doAddError)
          .catch(() => this.doAddError("400 response is not text"));
    } else {
      this.doAddError(`bad status code from /api/add: ${resp.status}`);
    }
  };

  doAddJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/add: not a record", data);
      return;
    }
    this.props.onBackClick();  // show the updated list
  };

  doAddError = (msg: string): void => {
    this.setState({error: msg})
  };

  doBackClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.onBackClick();
  };

}
