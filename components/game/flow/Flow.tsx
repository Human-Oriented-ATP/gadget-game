import React, { useMemo } from 'react';
import { NodeTypes, EdgeTypes, ReactFlow, Background, BackgroundVariant, NodeProps, ConnectionMode } from '@xyflow/react';
import { useGameStateContext } from 'lib/state/StateContextProvider';
import { GameSlice } from 'lib/state/Store';
import { useShallow } from 'zustand/react/shallow';
import { GadgetFlowNode, GadgetNode } from './GadgetFlowNode';
import { CustomEdge } from './CustomEdge';
import { ConnectionLineComponent } from './ConnectionLineComponent';
import { ControlButtons } from './ControlButtons';
import '@xyflow/react/dist/base.css';
import './flow.css'
import { DoubleClickHandler } from '../gadget/handles/ConnectorTypes';

const useNodeTypesWithHandler = (onHandleDoubleClick: DoubleClickHandler) => {
    const nodeTypes = useMemo(() => {
        return {
            'gadgetNode': (props: NodeProps<GadgetNode>) =>
                <GadgetFlowNode {...props} onHandleDoubleClick={onHandleDoubleClick} />
        };
    }, [onHandleDoubleClick]);

    return nodeTypes;
};

const edgeTypes: EdgeTypes = { 'customEdge': CustomEdge }

const selector = (state: GameSlice) => ({
    nodes: state.nodes,
    edges: state.edges,
    onInit: state.onInit,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    onConnectStart: state.onConnectStart,
    onConnectEnd: state.onConnectEnd,
    onEdgeClick: state.onEdgeClick,
    onHandleDoubleClick: state.onHandleDoubleClick,
    isValidConnection: state.isValidConnection,
    onBeforeDelete: state.onBeforeDelete,
    onNodeDrag: state.onNodeDrag,
    onNodeDragStop: state.onNodeDragStop,
    hideAnimatedTutorialContent: state.hideAnimatedTutorialContent,
    showAnimatedTutorialContent: state.showAnimatedTutorialContent,
    settings: state.setup.settings,
});

export function Flow() {
    const { nodes, edges, onInit, onNodesChange, onEdgesChange, onConnect, onConnectStart, onConnectEnd, onEdgeClick,
        onHandleDoubleClick, isValidConnection, onBeforeDelete, onNodeDrag, onNodeDragStop,
        hideAnimatedTutorialContent, showAnimatedTutorialContent, settings } = useGameStateContext(useShallow(selector));

    // Double clicking is handled within the CustomHandle component
    const nodeTypes = useNodeTypesWithHandler(onHandleDoubleClick);
    const zoomProps = settings.zoomEnabled ? { minZoom: 0.1 } : { minZoom: 1, maxZoom: 1 }

    return <>
        <ReactFlow
            className='relative'
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onBeforeDelete={onBeforeDelete}
            edgeTypes={edgeTypes}
            nodeTypes={nodeTypes}
            onInit={onInit}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            onEdgeClick={onEdgeClick}
            isValidConnection={isValidConnection}
            onNodeDrag={onNodeDrag}
            onNodeDragStart={hideAnimatedTutorialContent}
            onNodeDragStop={onNodeDragStop}
            nodeOrigin={[0.5, 0.5]}
            onMove={hideAnimatedTutorialContent}
            onMoveEnd={showAnimatedTutorialContent}
            {...zoomProps}
            panOnDrag={settings.panEnabled}
            connectionLineComponent={ConnectionLineComponent}
            zoomOnDoubleClick={false}
            autoPanOnConnect={false}
            autoPanOnNodeDrag={false}
            connectOnClick={false}
            connectionDragThreshold={8}
            connectionMode={ConnectionMode.Loose}
        >
            <Background color="#bbb" size={1.8} variant={BackgroundVariant.Dots} />
        </ReactFlow>
        <ControlButtons />
    </>
}
