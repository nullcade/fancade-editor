export default class<T, S> {
    private map: Map<T, S>;
    private revMap: Map<S, T>;
    constructor() {
        this.map = new Map<T, S>();
        this.revMap = new Map<S, T>();
    }

    get(key: T){
        return this.map.get(key);
    }
    reverseGet(key: S){
        return this.revMap.get(key);
    }

    set(key: T, value: S){
        const revKey = this.map.get(key);
        if(revKey === value) return this;
        if(revKey || revKey === null){
            this.revMap.delete(revKey);
        }
        this.map.set(key, value);
        this.revMap.set(value, key);
        return this;
    }
    reverseSet(key: S, value: T){
        const revKey = this.revMap.get(key);
        if(revKey === value) return this;
        if(revKey || revKey === null){
            this.map.delete(revKey);
        }
        this.map.set(value, key);
        this.revMap.set(key, value);
        return this;
    }

    delete(key: T){
        const revKey = this.map.get(key);
        if(revKey === undefined) return false;
        this.map.delete(key);
        this.revMap.delete(revKey);
        return true;
    }
    reverseDelete(key: S){
        const revKey = this.revMap.get(key);
        if(revKey === undefined) return false;
        this.revMap.delete(key);
        this.map.delete(revKey);
        return true;
    }
}