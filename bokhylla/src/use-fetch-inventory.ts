import { useEffect, useState } from 'react';
import type { IngredientInfo, PartialInventory } from './inventory';

async function safeFetchJson<T>(url: string | URL, init?: RequestInit) {
    return fetch(url, init).then((response) => {
        if (!response.ok) {
            throw new Error(
                `${url} returned status ${response.status} - (${response.statusText})}`,
            );
        }
        return response.json() as Promise<T>;
    });
}

/** PartialInventory is read only, remove the write protection from the type */
type Writeable<T> = { -readonly [P in keyof T]: T[P] };

async function fetchInventory(baseURL: string): Promise<PartialInventory> {
    const inventory: Writeable<PartialInventory> = {};
    const kinds = ['foundation', 'protein', 'extra', 'dressing'];


    const nameLists = await Promise.all( 
        kinds.map((kind) => safeFetchJson<string[]>(new URL(`${kind}s`, baseURL))),
    );

    await Promise.all(
        kinds.map((kind, i) =>
            Promise.all(
                nameLists[i].map(async (name) => {
                    inventory[name] = await safeFetchJson<IngredientInfo>(
                        new URL(`${kind}s/${name}`, baseURL),
                    );
                }),
            ),
        ),
    );

    return inventory;
}

function useFetchInventory(baseURL: string) {
    const [data, setData] = useState<PartialInventory>({});
    useEffect(() => {
        let ignore = false;
        fetchInventory(baseURL).then((inventory) => {
            if (!ignore) {
                setData(inventory);
            }
        });
        return () => {
            ignore = true;
        };
    }, [baseURL]);
    return data;
}

export { useFetchInventory, safeFetchJson, fetchInventory };
