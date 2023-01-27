import React from 'react';
import { addStyles, MathField, EditableMathField } from '@numberworks/react-mathquill'
import './App.css';

addStyles();

enum FieldType {
    Math = 'MATH',
    Text = 'TEXT'
}

interface MathNoteFieldProps {value: string, onFocus: () => null}

class MathNoteField extends React.Component {
    initialValue: string;
    handleFocus: () => null;
    state: {
        type: FieldType
    };

    constructor(props: MathNoteFieldProps) {
        super(props);
        this.state = { type: FieldType.Math };
        this.initialValue = props.value ?? '';
        this.handleFocus = props.onFocus;
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
                <EditableMathField latex={this.initialValue} onChange={this.handleChange} config={{spaceBehavesLikeTab: true}} onFocus={this.handleFocus} />
                : <input autoFocus className="text-note" onFocus={this.handleFocus}/>
        )
    }
}

interface Props {}

class App extends React.Component {
    state: {lines: React.ReactElement[], focusedIndex: number};
    
    constructor(props: Props) {
        super(props);
        this.state = {lines: [<MathNoteField />], focusedIndex: 0};
        this.setFocus = this.setFocus.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    
    setFocus(index: number) {
        this.setState({focusedIndex: index});
    }
    
    handleKeyDown(event: React.KeyboardEvent) {
        switch (event.key) {
            case "ArrowUp":
                //..
                this.state.lines.forEach((e, i) => {
                    
                    
                })
                 break;
            case "ArrowDown":
            case "Enter":
                this.setFocus(2);
               break;
            default:
                return;

        }
        event.preventDefault();
    }

    render() {
        return (
            <div className="App">
                {this.state.lines}
            </div>
        );
    }
}

export default App;
