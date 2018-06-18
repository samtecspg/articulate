import React, { Component } from 'react'
import { AutoComplete } from 'material-ui';
import PopoverAnimationVertical from 'material-ui/Popover/PopoverAnimationVertical';
import getMuiTheme          from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider     from 'material-ui/styles/MuiThemeProvider';
import Tooltip from '../Tooltip';
import { Icon } from 'react-materialize';

class Typeahead extends Component {
  constructor(props) {
    super(props);
    this.onUpdateInput  = this.onUpdateInput.bind(this);
  }

  onUpdateInput(inputValue) {
    const evt = {
      target: {
        value: inputValue
      }
    }
    this.props.callback(this.props.name, evt);
  }
  render() {
    return (
      <div style={this.props.style} className={`col input-field s${this.props.s}`}>
        <label className="typeahead-label">{this.props.label}</label>
        {this.props.tooltip ?
        <Tooltip
          tooltip={this.props.tooltip}
          delay={50}
          position="top"
        >
          <a style={{display: 'inline', top: '-10px', position: 'absolute'}}>
            <Icon tiny>help_outline</Icon>
          </a>
        </Tooltip> : null}
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <AutoComplete
            id                  ={this.props.id}
            searchText          ={this.props.value}
            maxSearchResults    ={this.props.maxSearchResults}
            filter              ={function (searchText, key) {
              if (searchText.length >= 2){
                return key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
              }
              return false;
            }}
            openOnFocus         ={true}
            fullWidth           ={true}
            dataSource          ={this.props.dataSource}
            onUpdateInput       ={this.onUpdateInput}
            animation           ={PopoverAnimationVertical}
            underlineShow       ={false}
            menuProps           ={{
              maxHeight: 250,
              className: this.props.menuClassName,
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