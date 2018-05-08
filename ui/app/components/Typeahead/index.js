import React, { Component } from 'react'
import { AutoComplete } from 'material-ui';
import PopoverAnimationVertical from 'material-ui/Popover/PopoverAnimationVertical';
import getMuiTheme          from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider     from 'material-ui/styles/MuiThemeProvider';
import timezones from 'timezones';
import { FormattedMessage } from 'react-intl';

class Typeahead extends Component {
  constructor(props) {
    super(props);
    this.onUpdateInput  = this.onUpdateInput.bind(this);
    this.state = {
      dataSource : timezones,
      inputValue : props.value
    }
  }

  onUpdateInput(inputValue) {
    this.setState({
      inputValue : inputValue
    });
    const evt = {
      target: {
        value: inputValue
      }
    }
    this.props.callback(this.props.name, evt);
  }
  render() {
    return (
      <div className={`col input-field s${this.props.s}`}>
        <label>{this.props.label}</label>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <AutoComplete
            id                  ={this.props.id}
            searchText          ={this.state.inputValue}
            maxSearchResults    ={this.props.maxSearchResults}
            filter              ={function (searchText, key) {
              if (searchText.length >= 2){
                return key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
              }
              return false;
            }}
            openOnFocus         ={true}
            fullWidth           ={true}
            dataSource          ={this.state.dataSource}
            onUpdateInput       ={this.onUpdateInput}
            animation           ={PopoverAnimationVertical}
            underlineShow       ={false}
            menuProps           ={{
              maxHeight: 250,
              className: 'timezones',
              menuItemStyle: {
                fontFamily: 'Montserrat',
                fontWeight: '300',
                fontSize: '15px',
              }
            }}
            inputStyle          ={{
              color: '#4e4e4e',
              paddingLeft: '15px',
              border: '1px solid #c5cbd8',
              height: '45px',
              fontWeight: '300',
              fontFamily: 'Montserrat',
              fontSize: '15px',
            }}
          />
        </MuiThemeProvider>
      </div>
    )
  }
}


export default Typeahead;