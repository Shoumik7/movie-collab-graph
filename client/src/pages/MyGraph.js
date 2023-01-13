import {Sigma, RandomizeNodePositions, RelativeSize} from 'react-sigma';


function MyGraph(props){

    let myGraph = {nodes:[{id:"n1", label:"Alice"}, {id:"n2", label:"Rabbit"}], edges:[{id:"e1",source:"n1",target:"n2",label:"SEES"}]};

    return (
        <Sigma graph={myGraph} settings={{drawEdges: true, clone: false}}>
            <RelativeSize initialSize={15}/>
            <RandomizeNodePositions/>
        </Sigma>
    )
}

export default MyGraph
