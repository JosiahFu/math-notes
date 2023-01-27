import React from 'react';
import { addStyles, MathField, EditableMathField } from '@numberworks/react-mathquill'
import './App.css';

addStyles();

enum FieldType {
    Math = 'MATH',
    Text = 'TEXT'
}

class MathNoteField extends React.Component {
    state: {
        type: FieldType, initialValue: string
    }

    constructor(props: { value: string }) {
        super(props);
        this.state = { type: FieldType.Math, initialValue: props.value ?? '' }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(field: MathField): void {
        if (field.latex() === '"') {
            this.setState({ type: FieldType.Text });
        }
    }

    render() {
        return (
            this.state.type === FieldType.Math ?
                <EditableMathField latex={this.state.initialValue} onChange={this.handleChange} config={{spaceBehavesLikeTab: true}} />
                : <input autoFocus className="text-note" />
        )
    }
}

function App() {
    return (
        <div className="App">
            <MathNoteField />
            <MathNoteField />
            <MathNoteField />
            <MathNoteField />
            <MathNoteField />
            <MathNoteField />
            <MathNoteField />
        </div>
    );
}

export default App;
