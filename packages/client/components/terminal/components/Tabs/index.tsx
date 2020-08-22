import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tab, TabBar, TabBarEmpty, TabClose, TabPlus } from './styled-elements';

function last(arr, pre = '') {
  let base = arr.length > 2 ? `${arr[arr.length - 2]}` : '';
  if (base.indexOf(`${pre}> `) !== 0) {
    base = 'bash';
  }
  return base.replace(`${pre}> `, '').split(' ')[0];
}

class Tabs extends Component<any, any> {
  static displayName = 'Tabs';

  static propTypes = {
    style: PropTypes.object, // eslint-disable-line
    active: PropTypes.string,
    setActiveTab: PropTypes.func,
    removeTab: PropTypes.func,
    createTab: PropTypes.func,
  };

  static defaultProps = {
    style: {},
  };

  static contextTypes = {
    instances: PropTypes.array,
    maximise: PropTypes.bool,
  };

  state = {
    showingPlus: false,
  };

  handleBarClick = (e) => {
    e.stopPropagation();
    this.props.createTab();
  };

  // handle clicking a tab
  handleTabClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.setActiveTab(index);
  };

  // handle remove clicked
  handleRemoveClick = (e, index, instance) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.removeTab(index, instance.props.id);
    return false;
  };

  removePlus = () => {
    if (this.state.showingPlus) {
      this.setState({ showingPlus: false });
    }
  }

  showPlus = () => {
    if (!this.state.showingPlus) {
      this.setState({ showingPlus: true });
    }
  }

  render() {
    const { showingPlus } = this.state;
    const { style, active } = this.props;
    const tabs = this.context.instances.map(({ index, instance }) => {
      const title = (instance && instance.state) ? last(instance.state.summary, instance.state.promptPrefix) : 'bash';
      return (
        <Tab
          key={index}
          active={active === index}
          onClick={e => this.handleTabClick(e, index)}
          onFocus={e => this.handleTabClick(e, index)}
          title={title}
          tabIndex={0}
        >
          {this.context.instances.length > 1 && (
            <TabClose
              title="Close Tab"
              onMouseDown={e => this.handleRemoveClick(e, index, instance)}
            >
              x
            </TabClose>
          )}
          {title}
        </Tab>
      );
    });

    return (
      <TabBar
        style={{
          ...style,
          ...(this.context.maximise ? { maxWidth: '100%' } : {}),
        }}
      >
        {tabs}
        <TabBarEmpty
          onMouseEnter={this.showPlus}
          onMouseLeave={this.removePlus}
        >
          <TabPlus
            visible={showingPlus}
            onClick={this.handleBarClick}
          >+
          </TabPlus>
        </TabBarEmpty>
      </TabBar>
    );
  }
}

export default Tabs;
