class LimitedSizeMap extends Map {
    constructor(maxSize) {
        super();
        this.maxSize = maxSize;
    }

    set(key, value) {
        super.set(key, value);
        if (this.size > this.maxSize) {
            const firstKey = this.keys().next().value;
            this.delete(firstKey);
        }
        return this;
    }
}

class LimitedTimeMap extends Map {
    constructor(maxLifetime) {
        super();
        this.maxLifetime = maxLifetime; // maximum lifetime for each item in milliseconds
        this.timeouts = new Map(); // to store timeouts for each key
    }

    set(key, value) {
        if (this.has(key)) {
            clearTimeout(this.timeouts.get(key)); // clear the existing timeout if the key already exists
        }

        super.set(key, value);

        const timeout = setTimeout(() => {
            this.delete(key);
            this.timeouts.delete(key);
        }, this.maxLifetime);

        this.timeouts.set(key, timeout);

        return this;
    }

    delete(key) {
        if (this.has(key)) {
            clearTimeout(this.timeouts.get(key));
            this.timeouts.delete(key);
        }
        return super.delete(key);
    }

    clear() {
        for (const key of this.keys()) {
            clearTimeout(this.timeouts.get(key));
        }
        this.timeouts.clear();
        super.clear();
    }
}

class AutoRefreshMap extends Map {
    constructor(maxLifetime) {
        super();
        this.maxLifetime = maxLifetime; // maximum lifetime for each item in milliseconds
        this.timeouts = new Map(); // to store timeouts for each key
        this.refreshMethods = new Map(); // to store refresh methods for each key
    }

    set(key, value, refreshMethod) {
        if (this.has(key)) {
            clearTimeout(this.timeouts.get(key)); // Clear the existing timeout if the key already exists
        }

        super.set(key, value);

        if (refreshMethod) {
            this.refreshMethods.set(key, refreshMethod);
        }

        this._startTimer(key);

        return this;
    }

    async _startTimer(key) {
        if (this.timeouts.has(key)) {
            clearTimeout(this.timeouts.get(key)); // Ensure no existing timer is running for this key
        }

        const timeout = setTimeout(async () => {
            const refreshMethod = this.refreshMethods.get(key);
            if (refreshMethod) {
                const newValue = await refreshMethod(key, this.get(key));
                if (this.has(key)) { // Ensure the key still exists before updating
                    super.set(key, newValue);
                }
            }

            // Start a new timer if the key still exists
            if (this.has(key)) {
                this._startTimer(key);
            }
        }, this.maxLifetime);

        this.timeouts.set(key, timeout);
    }

    delete(key) {
        if (this.has(key)) {
            clearTimeout(this.timeouts.get(key));
            this.timeouts.delete(key);
            this.refreshMethods.delete(key);
        }
        return super.delete(key);
    }

    clear() {
        for (const key of this.keys()) {
            clearTimeout(this.timeouts.get(key));
        }
        this.timeouts.clear();
        this.refreshMethods.clear();
        super.clear();
    }
}

const Episode_video = new LimitedSizeMap(50000)

const EpisodeData = new LimitedSizeMap(50000)

const Map_5_minutes = new LimitedTimeMap(300000)

const Map_10_minutes = new LimitedTimeMap(600000)

const Anime_details_10_minutes = new LimitedTimeMap(600000)

const Auto_refresh_map_10_minutes = new AutoRefreshMap(100000);

const Auto_refresh_map_30_minutes = new AutoRefreshMap(300000);

const Auto_refresh_map_12_hours = new AutoRefreshMap(43200000);

const Auto_refresh_episode_video_data_12_hours = new AutoRefreshMap(43200000);

const Static_data = new LimitedSizeMap(20000)

const Yugen_links = new LimitedSizeMap(10000)

const Episode_data_map = new LimitedSizeMap(50000)

module.exports = {
    LimitedTimeMap,
    Static_data,
    Episode_video,
    EpisodeData,
    Map_5_minutes,
    Map_10_minutes,
    Anime_details_10_minutes,
    Auto_refresh_map_10_minutes,
    Auto_refresh_map_30_minutes,
    Auto_refresh_map_12_hours,
    Auto_refresh_episode_video_data_12_hours,
    Yugen_links,
    Episode_data_map
}