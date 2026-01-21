import { defineStore } from 'pinia'

export const useUniverseStore = defineStore('universe', {
  state: () => ({
    selectedNode: null,
    hoveredNode: null,
    cameraPosition: { x: 0, y: 0, z: 20 },
    cameraTarget: { x: 0, y: 0, z: 0 },
    isTransitioning: false,
    isMobile: false,
    showMobileGrid: false,
    portalActive: false,
    viewMode: '3d' // '3d' or 'grid'
  }),

  getters: {
    hasSelection: state => !!state.selectedNode,
    isNodeHovered: state => nodeId => state.hoveredNode === nodeId,
    isNodeSelected: state => nodeId => state.selectedNode === nodeId
  },

  actions: {
    selectNode(nodeId) {
      this.selectedNode = nodeId
    },

    clearSelection() {
      this.selectedNode = null
    },

    setHoveredNode(nodeId) {
      this.hoveredNode = nodeId
    },

    clearHoveredNode() {
      this.hoveredNode = null
    },

    setCameraPosition(position) {
      this.cameraPosition = { ...position }
    },

    setCameraTarget(target) {
      this.cameraTarget = { ...target }
    },

    setTransitioning(value) {
      this.isTransitioning = value
    },

    setPortalActive(value) {
      this.portalActive = value
    },

    setMobile(value) {
      this.isMobile = value
      if (value) {
        this.viewMode = 'grid'
      }
    },

    toggleViewMode() {
      this.viewMode = this.viewMode === '3d' ? 'grid' : '3d'
    }
  }
})
