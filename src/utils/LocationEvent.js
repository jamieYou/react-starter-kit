export class LocationEvent {
  static instanceList: Map<string, LocationEvent> = new Map()

  static find(locationKey): LocationEvent {
    if (!this.instanceList.has(locationKey)) this.instanceList.set(locationKey, new this(locationKey))
    return this.instanceList.get(locationKey)
  }

  static tryReshowPage(locationKey) {
    if (this.instanceList.has(locationKey)) this.instanceList.get(locationKey).reshowPage()
  }

  static destroy(locationKey) {
    this.instanceList.delete(locationKey)
  }

  reshowList: Array<Function> = []

  set onReshow(func) {
    this.reshowList.push(func)
  }

  reshowPage() {
    this.reshowList.forEach(func => func())
  }
}
