export const Combo: React.FunctionComponent<any> = ({ name, value, items, onChange }) => {
    return <select className={'select'} name={name} onChange={onChange} value={value}>
        {items.map(function (item: any, index: number) {
            return <option key={index + 1} value={item.value}>{item.name}</option>
        })}
    </select>
}

export const Select: React.FunctionComponent<any> = ({ name, value, items, onChange }) => {
    return <select size={2} className={'select-list'} name={name} onChange={onChange} value={value}>
        {items.map(function (item: any, index: number) {
            return <option key={index + 1} value={item.value}>{item.name}</option>
        })}
    </select>
}