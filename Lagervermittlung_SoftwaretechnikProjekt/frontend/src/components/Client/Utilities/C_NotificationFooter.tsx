type Props = {
    status: string
}

function C_NotificationFooter({ status }: Props) {

    if(status === 'accept/dismiss') return "";
    

    return (
        <div>{status}</div>
    )
}

export default C_NotificationFooter;