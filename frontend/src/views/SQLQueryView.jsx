import { useState } from "react";

const schema = [
    {
        table: "app_item",
        fields: [
            "id (PK)",
            "name (varchar 100)",
            "eq_item_id (int)",
            "icon_id (int)",
            "item_score (int, nullable)",
            "slots (int, nullable)",
        ],
    },
    {
        table: "app_player",
        fields: [
            "id (PK)",
            "name (varchar 100, UNIQUE case-insensitive)",
            "discord_id (varchar 100, nullable)",
            "active (boolean, default true)",
            "created_at (datetime)",
            "updated_at (datetime)",
            "UNIQUE LOWER(name)",
        ],
    },
    {
        table: "app_character",
        fields: [
            "id (PK)",
            "name (varchar 100, UNIQUE)",
            "player_id (FK → app_player.id)",
            "is_main (boolean)",
            "is_main_alt (boolean)",
            "char_class (varchar 3)",
            "created_at",
            "updated_at",
            "UNIQUE (player where is_main = true)",
            "UNIQUE (player where is_main_alt = true)",
        ],
    },
    {
        table: "app_raid",
        fields: [
            "id (PK)",
            "name (varchar 100)",
            "zone_id (FK → app_zone.id, nullable)",
            "created_at",
            "updated_at",
        ],
    },
    {
        table: "app_raidattendance",
        fields: [
            "id (PK)",
            "raid_id (FK → app_raid.id)",
            "player_id (FK → app_player.id)",
            "created_at",
            "updated_at",
            "UNIQUE (raid_id, player_id)",
        ],
    },
    {
        table: "app_itemawarded",
        fields: [
            "id (PK)",
            "item_id (FK → app_item.id)",
            "raid_id (FK → app_raid.id, nullable)",
            "player_id (FK → app_player.id)",
            "alt_loot (boolean)",
            "preferred (boolean)",
            "magelo (boolean)",
            "type (string): main, alt, preferred, preferred_magelo, main_magelo, alt_magelo",
            "created_at",
            "updated_at",
        ],
    },
];

export function SQLQueryView() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);

    const runQuery = async () => {
        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const res = await fetch("/api/sql/query/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data?.error || "Request failed");

            setResults(data.results);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <h2 style={styles.title}>SQL Query Console</h2>

            {/* Schema */}
            <div style={styles.schemaWrap}>
                {schema.map((t) => (
                    <div key={t.table} style={styles.card}>
                        <div style={styles.tableName}>{t.table}</div>
                        <div style={styles.fields}>
                            {t.fields.map((f, i) => (
                                <div key={i} style={styles.field}>
                                    {f}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Editor */}
            <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter SQL SELECT query..."
                rows={6}
                style={styles.textarea}
            />

            <button
                onClick={runQuery}
                disabled={loading || !query}
                style={styles.button}
            >
                {loading ? "Running..." : "Run Query"}
            </button>

            {error && <div style={styles.error}>Error: {error}</div>}

            {/* Results */}
            {results && (
                <div style={styles.results}>
                    <h3>Results</h3>

                    {results.length === 0 ? (
                        <p>No rows returned</p>
                    ) : (
                        <table style={styles.table}>
                            <thead>
                            <tr>
                                {Object.keys(results[0]).map((k) => (
                                    <th key={k} style={styles.th}>
                                        {k}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {results.map((row, i) => (
                                <tr key={i}>
                                    {Object.values(row).map((v, j) => (
                                        <td key={j} style={styles.td}>
                                            {String(v)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

const styles = {
    page: {
        padding: 24,
        fontFamily: "sans-serif",
        background: "#000000",
        color: "#e2e8f0",
        minHeight: "100vh",
    },
    title: {
        marginBottom: 16,
    },
    schemaWrap: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
        marginBottom: 20,
    },
    card: {
        background: "#111827",
        padding: 12,
        borderRadius: 8,
        border: "1px solid #1f2937",
    },
    tableName: {
        fontWeight: "bold",
        marginBottom: 6,
        color: "#60a5fa",
    },
    fields: {
        display: "flex",
        flexDirection: "column",
        gap: 4,
        fontFamily: "monospace",
        fontSize: 12,
        opacity: 0.9,
    },
    field: {
        paddingLeft: 8,
    },
    textarea: {
        width: "100%",
        marginBottom: 10,
        padding: 10,
        borderRadius: 6,
        border: "1px solid #334155",
        background: "#0b1220",
        color: "#e2e8f0",
        fontFamily: "monospace",
    },
    button: {
        padding: "8px 12px",
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
    },
    error: {
        color: "#f87171",
        marginTop: 10,
    },
    results: {
        marginTop: 20,
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        tableLayout: "fixed",
    },
    th: {
        textAlign: "left",
        borderBottom: "1px solid #334155",
        padding: 6,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    td: {
        textAlign: "left",
        borderBottom: "1px solid #1f2937",
        padding: 6,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        verticalAlign: "top",
    },
};