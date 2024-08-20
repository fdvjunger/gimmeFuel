// ErrorBoundary.js
import React, { Component } from 'react';
import { Text, View } from 'react-native';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <View><Text>Something went wrong.</Text></View>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
